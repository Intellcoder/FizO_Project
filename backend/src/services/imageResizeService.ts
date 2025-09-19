import sharp from "sharp";

async function cropBlackRegion(
  inputPath: string,
  outputPath: string,
  targetWidth = 1920
) {
  const resizedBuffer = await sharp(inputPath)
    .resize({ width: targetWidth })
    .toBuffer();

  const info = await sharp(resizedBuffer).metadata();

  if (!info.width || !info.height) throw new Error("Image info not available");

  //fixed position cropping
  const boxWidthPercent = 0.38; //23% of  width
  const boxHeightPercent = 0.55; //18% of height

  const left = Math.floor(info.width * (1 - boxWidthPercent));
  const top = Math.floor(info.height * 0.02);
  const width = Math.floor(info.width * boxWidthPercent);
  const height = Math.floor(info.height * boxHeightPercent);

  const topRightBuffer = await sharp(resizedBuffer)
    .extract({ left, top, width, height })
    .toBuffer();

  const { data, info: croppedInfo } = await sharp(topRightBuffer)
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let minX = croppedInfo.width,
    minY = croppedInfo.height,
    maxX = 0,
    maxY = 0;
  const threshold = 50;

  for (let y = 0; y < croppedInfo.height; y++) {
    for (let x = 0; x < croppedInfo.width; x++) {
      const pixelValue = data[y * croppedInfo.width + x];

      if (pixelValue < threshold) {
        if (x < minX) minX = x;
        if (y < minY) minX = y;
        if (x > maxX) maxX = x;
        if (x > maxY) maxY = y;
      }
    }
  }

  const cropWidth = maxX - minX;
  const cropHeight = maxY - minY;

  if (cropWidth < 5 || cropHeight) {
    await sharp(topRightBuffer).toFile(outputPath);
    return outputPath;
  }

  await sharp(topRightBuffer)
    .extract({
      left: minX,
      top: minY,
      width: cropWidth,
      height: cropHeight,
    })
    .toFile(outputPath);
  return outputPath;
}
export default cropBlackRegion;
