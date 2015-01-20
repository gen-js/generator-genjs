'use strict';
var util = require('util'),
    yeoman = require('yeoman-generator'),
    gutil = require('gutil'),
    scriptBase = require('../script-base');
gutil.string();

var AddGenerator = module.exports = function EntityGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);
    this.loadGenJS();
};

util.inherits(AddGenerator, yeoman.generators.Base);
util.inherits(AddGenerator, scriptBase);

AddGenerator.prototype.askFor = function askFor() {
    var $this = this;

    var cb = this.async();

    var genJS = this.genJS;

    var genChoices = this.getGenChoices();

    this.prompt([
            {
                type: 'checkbox',
                name: 'templateAndEntitys',
                message: 'Generations',
                default: false,
                choices: genChoices
            }
        ],
        function (props) {
            $this.templateAndEntitys = props.templateAndEntitys;
            cb();
        }
    );
};

AddGenerator.prototype.files = function files() {
    var entitiesByTemplates = this.config.get('entitiesByTemplates');
    if(entitiesByTemplates != null) {
        if (this.templateAndEntitys == 'All') {
            this.config.set('entitiesByTemplates', null);
            this.config.save();
        } else {
            var templateAndEntitys = this.templateAndEntitys;
            if(templateAndEntitys != null) {
                for(var i=0; i<templateAndEntitys.length; i++) {
                    var templateToRemove = templateAndEntitys[i].template;
                    var entityToRemove = templateAndEntitys[i].entity;
                    var entities = entitiesByTemplates[templateToRemove];
                    if(entities != null) {
                        if(entityToRemove == 'All') {
                            delete entitiesByTemplates[templateToRemove];
                        } else {
                            var entities2 = [];
                            for (var j = 0; j < entities.length; j++) {
                                if (entityToRemove != entities[j]) {
                                    entities2.push(entities[j]);
                                }
                            }
                            if (entities2.length == 0) {
                                delete entitiesByTemplates[templateToRemove];
                            } else {
                                entitiesByTemplates[templateToRemove] = entities2;
                            }
                        }
                    }
                }
            }

            this.config.set('entitiesByTemplates', entitiesByTemplates);
            this.config.save();
        }
    }

    this.showList();
};
