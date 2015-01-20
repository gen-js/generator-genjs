var config = {
    inDir: "templates",
    outDir: "<%=targetDir%>",
    packageBase: "<%=package%>",
    overwrite: true,
    isWatching: true,
    watch:{
        includes:[
            "model", "helpers", "fragments", "templates", "config"
        ]
    }
};

module.exports = config;
