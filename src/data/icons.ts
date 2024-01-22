import fs from "fs";

const smallIconsFolder = "public/icons-xs/";
const largeIconsFolder = "public/icons-lg/";
const smallIconFiles = fs.readdirSync(smallIconsFolder);
const largeIconFiles = fs.readdirSync(largeIconsFolder);

export const smallIcons = Object.fromEntries(
  smallIconFiles.map(
    (iconFile) => [iconFile.split(".")[0], true] as [string, boolean]
  )
) as Record<string, boolean>;

export const largeIcons = Object.fromEntries(
  largeIconFiles.map(
    (iconFile) => [iconFile.split(".")[0], true] as [string, boolean]
  )
) as Record<string, boolean>;
