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
            var parentDir = currentPaths[currentPaths.length-2];
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
        }];

        this.prompt(prompts, function (props) {
            this.currentDir = props.currentDir;
            this.targetDir = path.join('..');
            this.projectName = props.projectName;
            this.projectDir = props.projectName;
            this.projectVersion = props.projectVersion;
            this.package = props.package;

            this.config.set(props);
            this.config.save();

            done();
        }.bind(this));
    },

    app: function () {
        this.copy('package.json', process.cwd()+'/package.json');
    },

    projectfiles: function () {

/*
        if(this.currentDir != null && this.currentDir != '') {
            this.mkdir(this.currentDir);
        }
*/
        // this.mkdir(process.cwd()+'/'+this.projectName);

        this.template('main.js',process.cwd()+'/main.js');
        this.template('gen.js',process.cwd()+'/gen.js');

	this.mkdir(process.cwd()+'/bundles');

        this.mkdir(process.cwd()+'/templates');

        this.mkdir(process.cwd()+'/config');
        this.template('config/bundles.js',process.cwd()+'/config/bundles.js');
        this.template('config/config.js',process.cwd()+'/config/config.js');
        this.template('config/context.js',process.cwd()+'/config/context.js');
        this.template('config/filters.js',process.cwd()+'/config/filters.js');
        this.template('config/getGenerations.js',process.cwd()+'/config/getGenerations.js');
        this.template('config/helpers.js',process.cwd()+'/config/helpers.js');

        this.mkdir(process.cwd()+'/model');
        this.copy('model/model.js',process.cwd()+'/model/model.js');
        this.copy('model/stereotypes.js',process.cwd()+'/model/stereotypes.js');
        this.copy('model/templates.js',process.cwd()+'/model/templates.js');

        this.mkdir(process.cwd()+'/helpers');
        this.copy('helpers/helper.js',process.cwd()+'/helpers/helper.js');

        this.mkdir(process.cwd()+'/fragments');
    }
});

module.exports = GenjsGenerator;
