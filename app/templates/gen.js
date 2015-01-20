var GenJS = require('/Users/ludovicchaboud/Code/workspace_genjs/genjs/genjs/lib/genjs');

var genJS = new GenJS({
    dir: process.cwd(),
    config: "./config/config.js",
    context: "./config/context.js",
    helpers: "./config/helpers.js",
    bundles: "./config/bundles.js",
    filters: "./config/filters.js",
    stereotypes: ['./model/stereotypes.js'],
    entities: ["./model/model.js"],
    templates: ["./model/templates.js"],
    templatesDirs: ['./templates'],
    getGenerations: ["./config/getGenerations.js"]
});

module.exports = genJS;
