import fetch from "node-fetch";
import { glob } from "glob";
import path from "path";
import https from "https";
import fs from "fs";
import cliProgress from "cli-progress";
import { Readable } from "stream";

import "dotenv/config";

const NUM_WORKERS = 64;
const ACCESS_KEY = process.env.BUNNY_ACCESS_KEY!;

if (!ACCESS_KEY) {
  throw new Error("BUNNY_ACCESS_KEY environment variable not set");
}

async function listPullZones() {
  const url =
    "https://api.bunny.net/pullzone?page=0&perPage=1000&includeCertificate=false";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      AccessKey: ACCESS_KEY,
    },
  };

  const response = await fetch(url, options);

  if (response.status !== 200) {
    throw new Error(`Error listing pull zones: ${await response.text()}`);
  }

  return (await response.json()) as PullZone[];
}

async function findPullZone(name: string) {
  const pullZones = await listPullZones();
  return pullZones.find((zone: any) => zone.Name === name);
}

async function listStorageZomes() {
  const url = "https://api.bunny.net/storagezone";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      AccessKey: ACCESS_KEY,
    },
  };

  const response = await fetch(url, options);

  if (response.status !== 200) {
    throw new Error(`Error listing storage zones: ${await response.text()}`);
  }

  return (await response.json()) as StorageZone[];
}

export async function findStorageZone(name: string) {
  const storageZones = await listStorageZomes();
  return storageZones.find((zone) => zone.Name === name);
}

async function createStorageZone(prefix: string) {
  const date = new Date()
    .toISOString()
    .slice(0, -5)
    .replaceAll(/[-:TZ\.]/g, "-");
  const name = prefix + "-" + date;

  console.log(`Creating storage zone ${name}...`);

  const response = await fetch("https://api.bunny.net/storagezone", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      AccessKey: ACCESS_KEY,
    },
    body: JSON.stringify({ ZoneTier: 0, Name: name, Region: "DE" }),
  });

  if (response.status !== 201) {
    throw new Error(`Error creating storage zone: ${await response.text()}`);
  }
  const storageZone = (await response.json()) as StorageZone;

  console.log(`Created storage zone ${name}`);

  return storageZone;
}

async function createPullZone(name: string, storageZone: StorageZone) {
  console.log(`Creating pull zone ${name}...`);

  const response = await fetch("https://api.bunny.net/pullzone", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      AccessKey: ACCESS_KEY,
    },
    body: JSON.stringify({
      StorageZoneId: storageZone.Id,
      Name: name,
      EnableSmartCache: true,
    }),
  });

  if (response.status !== 201) {
    throw new Error(`Error creating pull zone: ${await response.text()}`);
  }

  const pullZone = await response.json();

  console.log(`Created pull zone ${name}`);

  return pullZone;
}

export async function listFiles(storageZone: StorageZone, path: string = "") {
  if (!path.startsWith("/") || !path.endsWith("/")) {
    throw new Error("Invalid path: Path must start and end with a slash");
  }

  // const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const url = `https://${storageZone.StorageHostname}/${storageZone.Name}${path}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      AccessKey: storageZone.Password,
    },
  };

  const response = await fetch(url, options);

  if (response.status !== 200) {
    throw new Error(`Error listing files: ${await response.text()}`);
  }

  return (await response.json()) as FileInfo[];
}

export async function purgeUrl(url: string) {
  if (!url.startsWith("https://") || !url.includes(".b-cdn.net")) {
    // Please enter the exact CDN URL of an individual file. You can also
    // purge folders or wildcard files using * inside of the URL path.
    // Ex: https://pullzone.b-cdn.net/folder/* or https://pullzone.b-cdn.net/folder/file
    throw new Error("Invalid URL. Must be a BunnyCDN URL");
  }

  const apiUrl = "https://api.bunny.net/purge?url=" + encodeURIComponent(url);
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      AccessKey: ACCESS_KEY,
    },
  };

  const response = await fetch(apiUrl, options);

  if (response.status !== 200) {
    throw new Error(`Error purging URL: ${await response.text()}`);
  }
}

export const uploadFile = async (
  destinationPath: string,
  file: string | Buffer,
  storageZone: StorageZone,
  retries: number = 5
) => {
  const readStream =
    file instanceof Buffer ? Readable.from(file) : fs.createReadStream(file);

  const options: https.RequestOptions = {
    method: "PUT",
    host: storageZone.StorageHostname,
    path: `/${storageZone.Name}/${destinationPath}`,
    headers: {
      AccessKey: storageZone.Password,
      "Content-Type": "application/octet-stream",
    },
  };

  return new Promise<any>((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk.toString("utf8");
      });
      res.on("end", () => {
        resolve(JSON.parse(data));
      });
    });

    req.on("error", (error) => {
      console.log(`Error uploading ${destinationPath}: ${error.message}`);
      if (retries <= 0) {
        reject(error);
      } else {
        resolve(uploadFile(destinationPath, file, storageZone, retries - 1));
      }
    });

    readStream.pipe(req);
  });
};

export const downloadFile = async (
  path: string,
  storageZone: StorageZone,
  retries: number = 5
): Promise<Buffer> => {
  const url = `https://${storageZone.StorageHostname}/${storageZone.Name}/${path}`;
  const options = {
    method: "GET",
    headers: {
      accept: "*/*",
      AccessKey: storageZone.Password,
    },
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Failed to fetch file ${path}: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.log(`Error downloading ${path}: ${error}`);
    if (retries <= 0) {
      throw error;
    }
    return downloadFile(path, storageZone, retries - 1);
  }
};

function parallelFor<T>(
  data: T[],
  callback: (item: T, index: number) => Promise<void>,
  numThreads: number
) {
  let i = 0;

  function next(): Promise<void> {
    const index = i++;
    if (index < data.length) {
      return callback(data[index]!, index).then(next);
    }

    return Promise.resolve();
  }

  return Promise.all(new Array(numThreads).fill(0).map(next));
}

async function deleteStorageZone(storageZone: StorageZone) {
  console.log(`Deleting storage zone: ${storageZone.Name}...`);

  const url = `https://api.bunny.net/storagezone/${storageZone.Id}`;
  const options = {
    method: "DELETE",
    headers: {
      AccessKey: ACCESS_KEY,
    },
    timeout: 600000,
  };

  const response = await fetch(url, options);

  if (response.status !== 204) {
    throw new Error(`Error deleting storage zone: ${await response.text()}`);
  }

  console.log(`\nDeleted storage zone: ${storageZone.Name}`);
}

async function updatePullZone(pullZone: PullZone, storageZone: StorageZone) {
  console.log(`Updating pull zone ${pullZone.Name}...`);

  const oldStorageZoneId = pullZone.StorageZoneId;

  // Update storage zone
  {
    const url = `https://api.bunny.net/pullzone/${pullZone.Id}`;
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        AccessKey: ACCESS_KEY,
      },
      body: JSON.stringify({
        OriginType: 2,
        StorageZoneId: storageZone.Id,
      }),
    };

    const response = await fetch(url, options);

    if (response.status !== 200) {
      throw new Error(`Error updating storage zone: ${await response.text()}`);
    }
  }

  // Purge cache
  {
    const url = `https://api.bunny.net/pullzone/${pullZone.Id}/purgeCache`;
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        AccessKey: ACCESS_KEY,
      },
    };

    const response = await fetch(url, options);

    if (response.status !== 204) {
      throw new Error(`Error purging cache: ${await response.text()}`);
    }
  }

  // Delete old storage zone (if not used by other pull zones)
  {
    const url = `https://api.bunny.net/storagezone/${oldStorageZoneId}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        AccessKey: ACCESS_KEY,
      },
    };

    const response = await fetch(url, options);

    if (response.status !== 200) {
      throw new Error(
        `Error getting old storage zone: ${await response.text()}`
      );
    }

    const oldStorageZone = await response.json();

    if (!oldStorageZone.PullZones.length) {
      await deleteStorageZone(oldStorageZone);
    }
  }
}

async function uploadFiles(
  rootFolder: string,
  storageZone: StorageZone,
  cancelObj = { canceled: false }
) {
  const files = glob
    .sync(`${rootFolder}/**/*`, { nodir: true })
    .map((file) => path.relative(rootFolder, file));

  console.log(`Uploading ${files.length} files...`);

  const progressBar = new cliProgress.SingleBar(
    {
      format:
        "Progress |" +
        "{bar}" +
        "| {percentage}% || {value}/{total} files || ETA: {eta}s || {file}",
      barCompleteChar: "\u2588",
      barIncompleteChar: "\u2591",
      hideCursor: true,
    },
    cliProgress.Presets.shades_classic
  );

  progressBar.start(files.length, 0);

  let completed = 0;

  await parallelFor(
    files,
    async (file) => {
      if (cancelObj.canceled) {
        return;
      }

      const sourcePath = `${rootFolder}/${file}`;
      let destinationPath = file.replaceAll("\\", "/");
      if (
        destinationPath.endsWith(".html") &&
        !destinationPath.endsWith("index.html")
      ) {
        destinationPath = destinationPath.replace(/.html$/, "/index.html");
      }
      const response = await uploadFile(
        destinationPath,
        sourcePath,
        storageZone,
        15
      );

      if (cancelObj.canceled) {
        return;
      }

      if (response && response.HttpCode !== 201) {
        console.log(`Error uploading ${file}: ${JSON.stringify(response)}`);
      }
      completed += 1;
      if (completed % 1 === 0) {
        progressBar.update(completed, { file });
      }
    },
    NUM_WORKERS
  );

  if (!cancelObj.canceled) {
    progressBar.stop();
  }
}

if (require.main === module) {
  main();
}

async function main() {
  const [, , pullZoneName] = process.argv;

  if (!pullZoneName) {
    console.error("Usage: npx run deploy <pull-zone-name>");
    process.exit(1);
  }

  const storageZone = await createStorageZone(pullZoneName);
  const cancelObj = { canceled: false };

  async function cleanup() {
    cancelObj.canceled = true;
    console.log("\nCanceled upload, deleting storage zone...");
    await deleteStorageZone(storageZone);
    console.log("");
    process.exit();
  }

  process.on("SIGINT", cleanup);
  await uploadFiles("out", storageZone, cancelObj);
  await uploadFile("bunnycdn_errors/404.html", "out/404.html", storageZone, 5);
  process.removeListener("SIGINT", cleanup);

  const pullZone = await findPullZone(pullZoneName);
  if (pullZone) {
    await updatePullZone(pullZone, storageZone);
  } else {
    await createPullZone(pullZoneName, storageZone);
  }

  console.log(`Deployed to https://${pullZoneName}.b-cdn.net/`);
}

export interface StorageZone {
  Id: number;
  UserId: string;
  Name: string;
  Password: string;
  DateModified: string;
  Deleted: boolean;
  StorageUsed: number;
  FilesStored: number;
  Region: string;
  ReplicationRegions: any[];
  PullZones: any;
  ReadOnlyPassword: string;
  Rewrite404To200: boolean;
  Custom404FilePath: any;
  StorageHostname: string;
  ZoneTier: number;
  ReplicationChangeInProgress: boolean;
  PriceOverride: number;
  Discount: number;
}

export interface Hostname {
  Id: number;
  Value: string;
  ForceSSL: boolean;
  IsSystemHostname: boolean;
  HasCertificate: boolean;
  Certificate: any;
  CertificateKey: any;
}

export interface PullZone {
  Id: number;
  Name: string;
  OriginUrl: string;
  Enabled: boolean;
  Suspended: boolean;
  Hostnames: Hostname[];
  StorageZoneId: number;
  EdgeScriptId: number;
  AllowedReferrers: any[];
  BlockedReferrers: any[];
  BlockedIps: any[];
  EnableGeoZoneUS: boolean;
  EnableGeoZoneEU: boolean;
  EnableGeoZoneASIA: boolean;
  EnableGeoZoneSA: boolean;
  EnableGeoZoneAF: boolean;
  ZoneSecurityEnabled: boolean;
  ZoneSecurityKey: string;
  ZoneSecurityIncludeHashRemoteIP: boolean;
  IgnoreQueryStrings: boolean;
  MonthlyBandwidthLimit: number;
  MonthlyBandwidthUsed: number;
  MonthlyCharges: number;
  AddHostHeader: boolean;
  OriginHostHeader: string;
  Type: number;
  AccessControlOriginHeaderExtensions: string[];
  EnableAccessControlOriginHeader: boolean;
  DisableCookies: boolean;
  BudgetRedirectedCountries: any[];
  BlockedCountries: any[];
  EnableOriginShield: boolean;
  CacheControlMaxAgeOverride: number;
  CacheControlPublicMaxAgeOverride: number;
  BurstSize: number;
  RequestLimit: number;
  BlockRootPathAccess: boolean;
  BlockPostRequests: boolean;
  LimitRatePerSecond: number;
  LimitRateAfter: number;
  ConnectionLimitPerIPCount: number;
  PriceOverride: number;
  AddCanonicalHeader: boolean;
  EnableLogging: boolean;
  EnableCacheSlice: boolean;
  EnableSmartCache: boolean;
  EdgeRules: any[];
  EnableWebPVary: boolean;
  EnableAvifVary: boolean;
  EnableCountryCodeVary: boolean;
  EnableMobileVary: boolean;
  EnableCookieVary: boolean;
  CookieVaryParameters: any[];
  EnableHostnameVary: boolean;
  CnameDomain: string;
  AWSSigningEnabled: boolean;
  AWSSigningKey: any;
  AWSSigningSecret: any;
  AWSSigningRegionName: any;
  LoggingIPAnonymizationEnabled: boolean;
  EnableTLS1: boolean;
  EnableTLS1_1: boolean;
  VerifyOriginSSL: boolean;
  ErrorPageEnableCustomCode: boolean;
  ErrorPageCustomCode: any;
  ErrorPageEnableStatuspageWidget: boolean;
  ErrorPageStatuspageCode: any;
  ErrorPageWhitelabel: boolean;
  OriginShieldZoneCode: string;
  LogForwardingEnabled: boolean;
  LogForwardingHostname: any;
  LogForwardingPort: number;
  LogForwardingToken: any;
  LogForwardingProtocol: number;
  LoggingSaveToStorage: boolean;
  LoggingStorageZoneId: number;
  FollowRedirects: boolean;
  VideoLibraryId: number;
  DnsRecordId: number;
  DnsZoneId: number;
  DnsRecordValue: any;
  OptimizerEnabled: boolean;
  OptimizerDesktopMaxWidth: number;
  OptimizerMobileMaxWidth: number;
  OptimizerImageQuality: number;
  OptimizerMobileImageQuality: number;
  OptimizerEnableWebP: boolean;
  OptimizerEnableManipulationEngine: boolean;
  OptimizerMinifyCSS: boolean;
  OptimizerMinifyJavaScript: boolean;
  OptimizerWatermarkEnabled: boolean;
  OptimizerWatermarkUrl: string;
  OptimizerWatermarkPosition: number;
  OptimizerWatermarkOffset: number;
  OptimizerWatermarkMinImageSize: number;
  OptimizerAutomaticOptimizationEnabled: boolean;
  PermaCacheStorageZoneId: number;
  OriginRetries: number;
  OriginConnectTimeout: number;
  OriginResponseTimeout: number;
  UseStaleWhileUpdating: boolean;
  UseStaleWhileOffline: boolean;
  OriginRetry5XXResponses: boolean;
  OriginRetryConnectionTimeout: boolean;
  OriginRetryResponseTimeout: boolean;
  OriginRetryDelay: number;
  QueryStringVaryParameters: any[];
  OriginShieldEnableConcurrencyLimit: boolean;
  OriginShieldMaxConcurrentRequests: number;
  EnableSafeHop: boolean;
  CacheErrorResponses: boolean;
  OriginShieldQueueMaxWaitTime: number;
  OriginShieldMaxQueuedRequests: number;
  OptimizerClasses: any[];
  OptimizerForceClasses: boolean;
  UseBackgroundUpdate: boolean;
  EnableAutoSSL: boolean;
  EnableQueryStringOrdering: boolean;
  LogAnonymizationType: number;
  LogFormat: number;
  LogForwardingFormat: number;
  ShieldDDosProtectionType: number;
  ShieldDDosProtectionEnabled: boolean;
  OriginType: number;
  EnableRequestCoalescing: boolean;
  RequestCoalescingTimeout: number;
  OriginLinkValue: string;
  DisableLetsEncrypt: boolean;
  EnableBunnyImageAi: boolean;
  PreloadingScreenEnabled: boolean;
  PreloadingScreenShowOnFirstVisit: boolean;
  PreloadingScreenCode: string;
  PreloadingScreenLogoUrl: any;
  PreloadingScreenCodeEnabled: boolean;
  PreloadingScreenTheme: number;
  PreloadingScreenDelay: number;
  EUUSDiscount: number;
  SouthAmericaDiscount: number;
  AfricaDiscount: number;
  AsiaOceaniaDiscount: number;
  RoutingFilters: string[];
  BlockNoneReferrer: boolean;
}

export interface FileInfo {
  Guid: string;
  StorageZoneName: string;
  Path: string;
  ObjectName: string;
  Length: number;
  LastChanged: string;
  ServerId: number;
  ArrayNumber: number;
  IsDirectory: boolean;
  UserId: string;
  ContentType: string;
  DateCreated: string;
  StorageZoneId: number;
  Checksum: string | null;
  ReplicatedZones: string | null;
}
