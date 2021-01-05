/*
  MAIN API SERVER SETTINGS: Update these values accordingly to your preferred API/UI setup.
*/
module.exports = {
  // API server instance port. Warning: keep in sync with port defined at "proxy" property in package.json
  PORT: 8080,

  // Path to UI build folder - please note it must be RELATIVE to this manifest
  BUILD_PATH: '../build',

  // Filename for main entry file in UI build bundle
  BUILD_INDEX: 'index.html',
};
