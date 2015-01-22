'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


var GenjsGenerator = yeoman.generators.Base.extend({
    init: function () {
        this.pkg = require('../package.json');

        this.on('end', function () {
            if (!this.options['skip-install']) {
                this.installDependencies();
            }
        });
    },

    askFor: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay('Welcome to the GenJS Generator!'));

        try {
            var currentPaths = process.cwd().split(path.sep);
            var parentDir = currentPaths[currentPaths.length-1];
        } catch(e) {
            var parentDir = "myproject";
        }

        var prompts = [{
            type: 'input',
            name: 'projectName',
            message: 'Project name',
            default: parentDir
        },{
            type: 'input',
            name: 'projectVersion',
            message: 'Project version',
            default: '0.1'
        },{
            type: 'input',
            name:'package',
            message:'Root package',
            default: 'org.demo'
        },{
            type: 'list',
            name:'projectType',
            message:'Project type :',
            default: 'blank',
            choices: [{
              value: 'blank',
              name: 'Empty project'
            },{
              value: 'java',
              name: 'Sample Java project'
            }]
        }];

        this.prompt(prompts, function (props) {
            this.currentDir = props.currentDir;
            this.targetDir = path.join('out');
            this.projectName = props.projectName;
            this.projectDir = props.projectName;
            this.projectVersion = props.projectVersion;
            this.package = props.package;
            this.projectType = props.projectType;

            this.config.set(props);
            this.config.save();

            done();
        }.bind(this));
    },

    app: function () {

        this.copy('package.json', process.cwd()+'/package.json');
    },

    projectfiles: function () {

        this.template('main.js',process.cwd()+'/main.js');
	      this.mkdir(process.cwd()+'/bundles');
        this.mkdir(process.cwd()+'/data');
        this.copy('data/model.js',process.cwd()+'/data/model.js');
        this.template('data/global-variables.js',process.cwd()+'/data/global-variables.js');
        this.mkdir(process.cwd()+'/templates');
        this.mkdir(process.cwd()+'/out');

        if(this.projectType == 'blank') {
          this.copy('blank/templates/README.md',process.cwd()+'/templates/README.md');
          this.copy('blank/templates/model.yaml',process.cwd()+'/templates/model.yaml');
          this.copy('blank/templates/[name_a].yaml',process.cwd()+'/templates/[name_a].yaml');
        }
        if(this.projectType == 'java') {
          this.mkdir(process.cwd()+'/templates/src/main/java/PPP/domain');
          this.mkdir(process.cwd()+'/templates/src/main/java/PPP/repository');
          this.copy('java/templates/pom.xml',process.cwd()+'/templates/pom.xml');
          this.copy('java/templates/src/main/java/PPP/Main.java',process.cwd()+'/templates/src/main/java/PPP/Main.java');
          this.copy('java/templates/src/main/java/PPP/domain/[name_A].java',process.cwd()+'/templates/src/main/java/PPP/domain/[name_A].java');
          this.copy('java/templates/src/main/java/PPP/repository/[name_A]Repository.java',process.cwd()+'/templates/src/main/java/PPP/repository/[name_A]Repository.java');
        }
    }
});

module.exports = GenjsGenerator;
