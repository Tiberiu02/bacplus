require('dotenv').config();

const wget = require('wget-improved');
const cliProgress = require('cli-progress');

const DOWNLOAD_URL = process.env.DB_DOWNLOAD_URL;
const OUTPUT_FILE = process.env.DB_DOWNLOAD_PATH;

if (!DOWNLOAD_URL) {
    console.error("Environment variable DB_DOWNLOAD_URL is not set!");
    process.exit(1);
}

if (!OUTPUT_FILE) {
    console.error("Environment variable DB_DOWNLOAD_PATH is not set!");
    process.exit(1);
}

let bar = new cliProgress.SingleBar({
    format: 'Downloading database {bar} {percentage}% | {value}/{total} MB',
}, cliProgress.Presets.shades_classic);

let fSize = 0;

const download = wget.download(DOWNLOAD_URL, OUTPUT_FILE, {});
download.on('error', (err) => {
    console.log(err);
});
download.on('start', (fileSize) => {
    bar.start(Math.round(fileSize / 1_000_000 * 10) / 10, 0);
    fSize = fileSize;
});
download.on('end', (output) => {
    bar.stop();
    console.log("Download Completed!");
});
download.on('progress', (progress) => {
    typeof progress === 'number'
    bar.update(Math.round(progress * fSize / 1_000_000 * 10) / 10);
});