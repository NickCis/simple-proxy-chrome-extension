#!/usr/bin/env node

const chromeLaunch = require("chrome-launch");
const { resolve, join } = require("path");

const ExtensionPath = resolve(join(__dirname, ".."));

async function main() {
  chromeLaunch("https://ifconfig.me", {
    args: [`--load-extension=${ExtensionPath}`],
  });
}

main();
