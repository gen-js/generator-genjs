'use strict';
var util = require('util'),
    path = require('path'),
    yeoman = require('yeoman-generator'),
    chalk = require('chalk'),
    gutil = require('gutil'),
    scriptBase = require('../script-base');
var GenJS = require('../../genjs/lib/genjs');

var GenerateGenerator = module.exports = function EntityGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);
    this.loadGenJS();
};

util.inherits(GenerateGenerator, yeoman.generators.Base);
util.inherits(GenerateGenerator, scriptBase);

GenerateGenerator.prototype.files = function files() {
    this.config.set('entitiesByTemplates', null);
    this.config.save();
    this.showList();
};
