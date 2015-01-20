'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
// http://mikedeboer.github.io/node-github/
var gutil = require("gutil");
var GitHubApi = require("github");
var git = require('gift');
var fs = require('fs');
var rimraf = require('rimraf');

var BundlesGenerator = module.exports = function EntityGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
};

util.inherits(AddGenerator, yeoman.generators.Base);

BundlesGenerator.prototype.askFor = function askFor() {

    var done = this.async();

    var github = this.github = new GitHubApi({
      // required
      version: "3.0.0",
      // optional
      debug: false,
      timeout: 5000
    });
    var repoChoices = this.repoChoices = [];
    github.repos.getFromUser({user:"gen-js-bundles"}, function(err, data) {
      if(err != null) {
        console.log("error:"+err);
      } else {
        gutil.each(data, function(repo) {
          //console.log(repo.name);
          repoChoices.push({value:repo.name,name:repo.name});
        })
      }
      done();
    });

    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Add bundles to GenJS project'));

    try {
      var currentPaths = process.cwd().split(path.sep);
      var currentDir = currentPaths[currentPaths.length-1];
    } catch(e) {
      currentDir = "myproject";
    }

    var prompts = [{
      type: 'checkbox',
      name: 'bundles',
      message: 'Bundle',
      choices: this.repoChoices,
      default: 0
    }];

    this.prompt(prompts, function (props) {
      this.projectName = props.projectName;
      this.projectVersion = props.projectVersion;
      this.rootPkg = props.rootPkg;
      if(this.rootPkg != null) {
        this.entityPkg = props.rootPkg + ".model";
      }
      this.src = props.src;
      this.res = props.res;
      this.testSrc = props.testSrc;
      this.testRes = props.testRes;
      this.web = props.web;
      this.bundles = props.bundles;
      done();
    }.bind(this));
};

BundlesGenerator.prototype.files = function files() {

    // Download from github
    // Clone a given repository into a specific folder.
    if(this.bundles != null) {
      for(var i=0; i<this.bundles.length; i++) {
        var bundle = this.bundles[i];
        if(bundle != null && bundle != "" && bundle != "none") {
          // https://github.com/gen-js-bundles/sql-postgresql.git
          var giturl = "https://github.com/gen-js-bundles/"+bundle+".git";
          console.log('giturl',giturl );
          var dest = path.join(process.cwd(),'/bundles/',bundle);
          if(fs.existsSync(dest)) {
            console.log("=> Remove existing bundle : "+bundle);
            rimraf.sync(dest);
          }
          console.log("=> Download bundle : "+bundle+"");
          git.clone(giturl, dest, function(err, _repo) {
            if(err) {
              console.log(err);
            } else {
              console.log("=> Bundle downloaded");

              if(fs.existsSync(path.join(dest,"package.json"))) {
                // npm install
                var exec = require('child_process').exec;
                var child = exec('npm install',{cwd: dest}).stderr.pipe(process.stderr);
              }
            }
          });
        }
      }
    }
};
