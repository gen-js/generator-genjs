var GenJS = require('genjs');

var files = {
  dir: process.cwd(),
  context: "./data/global-variables.js",
  entities: ["./data/model.js"],
  templatesDirs: ['./templates'],
  bundlesDirs: ["./bundles"]
};

var config = {
  inDir: "templates",
  outDir: "<%=targetDir%>",
  packageBase: "<%=package%>",
  overwrite: true,
  isWatching: true,
  watch: {
    includes: [
      "data", "templates", "bundles"
    ]
  }
};

var genJS = new GenJS(files,config);

genJS.main();
