const child_process = require('child_process');
const path = require('path');
const yargs = require('yargs');

let args = yargs.argv;
let chrome_version = "";
let chrome_exectutable = "";

if(process.platform === "win32") {
    try {
        chrome_executable = child_process.execSync("powershell \"(Get-Item(Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\chrome.exe').'(Default)').VersionInfo.FileName\"").toString().trim();
    } catch(error) {
        // STDERR.puts chrome not installed
        process.exit(1);
    }

    chrome_version = child_process.execSync("powershell \"(Get-Item(Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\chrome.exe').'(Default)').VersionInfo.FileVersion\"").toString().trim();
} else {
    try {
        chrome_executable = child_process.execSync("command -v google-chrome").toString().trim();
    } catch(error) {
        // STDERR.puts chrome not installed
        process.exit(1);
    }

    chrome_version = child_process.execSync(`${chrome_executable} --version`).toString().trim();
}

let cwd = process.cwd();
files = args._;
destination = args.destination || cwd;

files.forEach((file) => {
    destination = path.resolve(destination);
    filePath = path.resolve(file);
    fileName = path.basename(file, path.extname(file))

    console.log(`"${chrome_executable}" --enable-logging --headless --disable-gpu --print-to-pdf="${path.join(destination, fileName + '.pdf')}" "file:///${encodeURIComponent(filePath)}"`);

    child_process.execSync(`"${chrome_executable}" --enable-logging --headless --disable-gpu --print-to-pdf="${path.join(destination, fileName + '.pdf')}" "file:///${filePath}"`);
})