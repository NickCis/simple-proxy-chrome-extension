const path = require("path");
const { promisify } = require("util");
const unlink = promisify(require("fs").unlink);
const AdmZip = require("adm-zip");
const { name, version } = require("../package.json");
const manifest = require("../manifest.json");

const assets = {
  folders: ["dist", "icons"],
  files: [],
};

const output = `${name}-${version}.zip`;

async function main() {
  try {
    await unlink(output);
  } catch (e) {}

  const zip = new AdmZip();

  for (const folder of assets.folders) {
    const local = path.resolve(path.join(__dirname, "..", folder));
    console.log(" > Adding folder", local, "->", folder);
    zip.addLocalFolder(local, folder);
  }

  for (const file of assets.files) {
    const local = path.resolve(path.join(__dirname, "..", file));
    console.log(" > Adding file", local, "->", file);
    zip.addLocalFile(local, file);
  }

  console.log(" > Adding manifest.json");
  zip.addFile(
    "manifest.json",
    Buffer.from(
      JSON.stringify({
        ...manifest,
        version,
      }),
      "utf8",
    ),
  );

  // Remove .map files
  for (const entry of zip.getEntries()) {
    if (entry.entryName.endsWith(".map")) {
      console.log(" > Removing map file", entry.entryName);
      zip.deleteFile(entry);
    }
  }

  console.log(" > Output", output);
  zip.writeZip(output);
}

main();
