import fetch from "node-fetch";
import { glob } from "glob";
import path from "path";
import https from "https";
import fs from "fs";
import cliProgress from "cli-progress";
import type { PullZone, StorageZone } from "./types";
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

const uploadFile = async (
  destinationPath: string,
  sourcePath: string,
  retries: number,
  storageZone: StorageZone
) => {
  const readStream = fs.createReadStream(sourcePath);

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
        resolve(
          uploadFile(destinationPath, sourcePath, retries - 1, storageZone)
        );
      }
    });

    readStream.pipe(req);
  });
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

  // Disable smart cache
  {
    const url = `https://api.bunny.net/pullzone/${pullZone.Id}`;
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        AccessKey: ACCESS_KEY,
      },
      body: JSON.stringify({ EnableSmartCache: false }),
    };

    const response = await fetch(url, options);

    if (response.status !== 200) {
      throw new Error(`Error disabling smart cache: ${await response.text()}`);
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
        EnableSmartCache: true,
      }),
    };

    const response = await fetch(url, options);

    if (response.status !== 200) {
      throw new Error(`Error updating storage zone: ${await response.text()}`);
    }
  }

  // Get old storage zone
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
        15,
        storageZone
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
  await uploadFile("bunnycdn_errors/404.html", "out/404.html", 5, storageZone);
  process.removeListener("SIGINT", cleanup);

  const pullZone = await findPullZone(pullZoneName);
  if (pullZone) {
    await updatePullZone(pullZone, storageZone);
  } else {
    await createPullZone(pullZoneName, storageZone);
  }

  console.log(`Deployed to https://${pullZoneName}.b-cdn.net/`);
}

main();
