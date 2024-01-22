import fs from "fs";

const iconsFolder = "public/icons-32/";
const iconFiles = fs.readdirSync(iconsFolder);

export const icons = Object.fromEntries(
  iconFiles.map(
    (iconFile) => [iconFile.split(".")[0], true] as [string, boolean]
  )
) as Record<string, boolean>;
