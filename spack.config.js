const path = require("path");
const { config } = require("@swc/core/spack");

module.exports = config({
  entry: {
    service_worker: path.join(__dirname, "src/service_worker.ts"),
    popup: path.join(__dirname, "src/popup.ts"),
  },
  output: {
    path: path.join(__dirname, "dist"),
  },
  module: {},
});
