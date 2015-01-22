var GenJS = require('genjs');

var genJS = new GenJS({
  dir: process.cwd(),
  config: "./config/config.js",
  context: "./config/context.js",
  helpers: "./config/helpers.js",
  bundles: "./config/bundles.js",
  bundlesDirs: ["./bundles"],
  filters: "./config/filters.js",
  stereotypes: ['./model/stereotypes.js'],
  entities: ["./model/model.js"],
  templates: ["./model/templates.js"],
  templatesDirs: ['./templates'],
  getGenerations: ["./config/getGenerations.js"]
});

module.exports = genJS;
