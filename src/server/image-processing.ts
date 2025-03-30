import sharp from "sharp";

export async function getImageDims(image: sharp.Sharp) {
  const metadata = await image.metadata();

  const [width, height] =
    (metadata.orientation || 0) >= 5
      ? [metadata.height, metadata.width]
      : [metadata.width, metadata.height];

  return [width, height];
}

export async function processPhoto(image: sharp.Sharp, maxSize: number) {
  const [width, height] = await getImageDims(image);

  // Skip if smaller than minSize
  if (!width || !height) {
    return null;
  }

  // Resize if larger than maxSize
  if (width > maxSize || height > maxSize) {
    const scale = Math.min(maxSize / width, maxSize / height);
    const newWidth = Math.round(width * scale);
    const newHeight = Math.round(height * scale);
    image = image.resize(newWidth, newHeight);
  }

  // Save the image
  return await image.webp().toBuffer();
}

export async function processSigla(
  image: sharp.Sharp,
  maxSize: number,
  minSize?: number
) {
  const metadata = await image.metadata();

  const [width, height] = await getImageDims(image);

  // Skip if smaller than minSize
  if (!width || !height || (minSize && width < minSize && height < minSize)) {
    return null;
  }

  let newImage = image;

  // Make the image square by expanding
  if (width !== height) {
    const new_size = Math.max(width, height);
    const hasTransparency = metadata.hasAlpha;

    console.log("resizing", width, height, new_size);

    const newBuffer = await sharp({
      create: {
        width: new_size,
        height: new_size,
        channels: hasTransparency ? 4 : 3,
        background: hasTransparency
          ? { r: 0, g: 0, b: 0, alpha: 0 }
          : { r: 255, g: 255, b: 255 },
      },
    })
      .composite([{ input: await image.toBuffer(), gravity: "center" }])
      .png()
      .toBuffer();

    newImage = sharp(newBuffer);
  }

  // Resize if larger than maxSize
  if (width > maxSize || height > maxSize) {
    newImage = newImage.resize(maxSize, maxSize);
  }

  // Save the image
  return await newImage.webp().toBuffer();
}

export function parseImageBase64DataUrl(dataUrl: string) {
  // const regex = /^data:.+\/(.+);base64,(.*)$/;
  const [header, data, other] = dataUrl.split(",");

  if (other !== undefined || data === undefined || header === undefined) {
    throw new Error("Invalid data URL: failed to split");
  }

  const [, ext] = header.match(/^data:image\/(.*?);base64/) ?? [];

  if (!ext) {
    throw new Error("Invalid data URL: header failed regex match");
  }

  const buffer = Buffer.from(data, "base64");

  return {
    ext,
    buffer,
  };
}
