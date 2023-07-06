const { createFFmpeg, fetchFile } = require('@ffmpeg/ffmpeg');
const fs = require('fs');

const path = require('path');
function convertToBase64(uint8Array) {
  const buffer = Buffer.from(uint8Array);
  return buffer.toString('base64');
}
function sandwichArgs(input, output, args) {
  args = args.map((str) => str.replace(/\s/g, ""));
  let arr1 = ['-i', input, 'args', output];
  const index = arr1.indexOf('args');
  //why sandwich? because the two first elements are the 'top' bun, the content is the args, and the 'bottom' bun is the output.
  if (index !== -1) {
    arr1.splice(index, 1, ...args);
  }
  return arr1;
}
async function generateThumbnail(ffmpeg, file) {
  ffmpeg.isLoaded() ? '' : await ffmpeg.load();
  await ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(file));
  await ffmpeg.run('-i', 'input.mp4', '-ss', '00:00:01', '-vframes', '1', 'output.jpg');
  const thumbnailData = ffmpeg.FS('readFile', 'output.jpg');
  const base64Thumbnail = convertToBase64(thumbnailData);
  ffmpeg.FS('unlink', 'output.jpg');
  ffmpeg.FS('unlink', 'input.mp4');
  return base64Thumbnail;
}
async function convert(ffmpeg, input, output, args) {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  let inputFile = `input${path.extname(input)}`;
  let outputFile = `output${path.extname(output)}`;
  console.log(sandwichArgs(inputFile, outputFile, args))
  try {
    await ffmpeg.FS('writeFile', inputFile, await fetchFile(input));
    await ffmpeg.run(...sandwichArgs(inputFile, outputFile, args));
    const data = ffmpeg.FS('readFile', outputFile);
    ffmpeg.FS('unlink', outputFile);
    ffmpeg.FS('unlink', inputFile);
    fs.writeFileSync(output, new Uint8Array(data.buffer));
  } catch (error) {
    console.log(error);
  }

}

module.exports.generateThumbnail = generateThumbnail;
module.exports.convert = convert;
