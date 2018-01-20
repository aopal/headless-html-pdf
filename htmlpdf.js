const child_process = require('child_process');
const path = require('path');
const fs = require('fs');
const yargs = require('yargs');

function update_config() {
    fs.writeFileSync("config.json", JSON.stringify(config));
}

function detect_chrome_install() {
    let chrome_executable;

    if (process.platform === "win32") {
        try {
            chrome_executable = child_process.execSync("powershell \"(Get-Item(Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\chrome.exe').'(Default)').VersionInfo.FileName\"").toString().trim();
        } catch (error) {
            console.error("Error: Could not detect a Chrome installation.");
            process.exit(1);
        }

        let chrome_version = child_process.execSync("powershell \"(Get-Item(Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\chrome.exe').'(Default)').VersionInfo.FileVersion\"").toString().trim();
        if (chrome_version < "60") {
            console.error("Error: Chrome 60+ required for headless mode on Windows");
            process.exit(1);
        }
    } else {
        try {
            chrome_executable = child_process.execSync("command -v google-chrome").toString().trim();
        } catch (error) {
            console.error("Error: Could not detect a Chrome installation.");
            process.exit(1);
        }

        let chrome_version = child_process.execSync(`${chrome_executable} --version`).toString().trim();
        if (chrome_version < "59") {
            console.error("Error: Chrome 59+ required for headless mode");
            process.exit(1);
        }
    }

    config["chrome_executable"] = chrome_executable;
    update_config();
    return chrome_executable;
}

const args = yargs.argv;
const config = JSON.parse(fs.readFileSync("config.json"));
if (args["set-executable"]) {
    config["chrome_executable"] = (args["set-executable"] !== "default") ? args["set-executable"] : detect_chrome_install();
    update_config();
    process.exit(0);
}

let chrome_executable = config["chrome_executable"] || detect_chrome_install();
let cwd = process.cwd();
files = args._;
destination = args.destination || cwd;

files.forEach((file) => {
    destination = path.resolve(destination);
    filePath = path.resolve(file);
    fileName = path.basename(file, path.extname(file));

    child_process.execSync(`"${chrome_executable}" --enable-logging --headless --disable-gpu --print-to-pdf="${path.join(destination, fileName + '.pdf')}" "file:///${filePath}"`);
})