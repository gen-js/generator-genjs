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

    var templatesByStereotypes = {};
    for (var i = 0; i < this.genJS.templates.length; i++) {
        var template = this.genJS.templates[i];
        if (template.stereotypes == null) {
            if (templatesByStereotypes['<no stereotype>'] == null) {
                templatesByStereotypes['<no stereotype>'] = [];
            }
            templatesByStereotypes['<no stereotype>'].push(template);
        } else {
            for (var j = 0; j < template.stereotypes.length; j++) {
                var stereotype = template.stereotypes[j];
                if (templatesByStereotypes[stereotype] == null) {
                    templatesByStereotypes[stereotype] = [];
                }
                templatesByStereotypes[stereotype].push(template);
            }
        }
    }
    this.templatesByStereotypes = templatesByStereotypes;

    var stereotypesChoices = [{
        value: "All",
        name: "All",
        checked: false
    }];
    for (var stereotype in templatesByStereotypes) {
        stereotypesChoices.push({
            value: stereotype,
            name: stereotype,
            checked: false
        });
    }

    var templatesChoices = [];
    for (var i = 0; i < this.genJS.templates.length; i++) {
        var template = this.genJS.templates[i];
        templatesChoices.push({
            value: template.id,
            name: template.name,
            checked: false
        });
    }

    var entitiesChoices = [{
        value: "All",
        name: "All entities",
        checked: false
    }];
    for (var i = 0; i < this.genJS.entities.length; i++) {
        var entity = this.genJS.entities[i];
        entitiesChoices.push({
            value: entity.id,
            name: entity.name,
            checked: false
        });
    }

    var templatesForSelectedStereotypes = [];
    var selectTemplates = function (stereotypes, entities) {
        // sample entity to display sample generated name for each template with XXX in their names
        var entity = null;
        if(entities != null) {
            entity = entities[0];
        }

        var templatesChoices = [{
            value: "All",
            name: "All",
            checked: false
        }];

        if (stereotypes == null) {
            return templatesChoices;
        }
        if (stereotypes == "All") {
            stereotypes = Object.keys(templatesByStereotypes);
        }

        var templates = [];
        for(var i=0; i<stereotypes.length; i++) {
            var stereotype = stereotypes[i];
            if(stereotype == '<no stereotype>') {
                for(var j=0; j<genJS.templates.length; j++) {
                    var template = genJS.templates[j];
                    if(template.stereotypes == null || template.stereotypes.length == 0) {
                        templates.push(template);
                    }
                }
            } else {
                gutil.addAll(templates, gutil.by(genJS.templates, 'stereotypes', stereotype));
            }
        }
        templates = gutil.unique(templates);
        templatesForSelectedStereotypes = templates;

        for(var i=0; i<templates.length; i++) {
            var template = templates[i];
            if($this.isSpecificTemplateForEntity(template)) {
                for (var j = 0; j < entities.length; j++) {
                    var entity = entities[j];
                    templatesChoices.push({
                        value: {template: template.id, entity: entity},
                        name: $this.getSampleGenerated(template, entity),
                        checked: false
                    });
                }
            } else {
                templatesChoices.push({
                    value: {template: template.id, entity: 'All'},
                    name: $this.getSampleGenerated(template),
                    checked: false
                });
            }
        }
        return templatesChoices;
    }

    // entities
    $this.prompt([
            {
                type: 'checkbox',
                name: 'entities',
                message: 'Entities',
                default: false,
                choices: entitiesChoices
            }
        ],
        function (props) {
            if(props.entities == 'All') {
                $this.entities = gutil.all(genJS.entities,"id");
            } else {
                $this.entities = props.entities;
            }

            // stereotypes
            $this.prompt([
                    {
                        type: 'checkbox',
                        name: 'stereotypes',
                        message: 'Templates group',
                        default: false,
                        choices: stereotypesChoices
                    }
                ],
                function(props) {
                    $this.stereotypes = props.stereotypes;

                    // templates
                    $this.prompt([
                            {
                                type: 'checkbox',
                                name: 'templateAndEntitys',
                                message: 'Templates',
                                default: false,
                                choices: selectTemplates($this.stereotypes, $this.entities)
                            }
                        ],
                        function(props) {
                            if(props.templateAndEntitys == 'All') {
                                var entitiesByTemplates = {};

                                if($this.entities.length > 0) {
                                    for (var i = 0; i < templatesForSelectedStereotypes.length; i++) {
                                        var template = templatesForSelectedStereotypes[i];
                                        if($this.isSpecificTemplateForEntity(template)) {
                                            var entities = entitiesByTemplates[template];
                                            if (entities == null) {
                                                entities = [];
                                            }
                                            for (var j = 0; j < $this.entities.length; j++) {
                                                var entity = $this.entities[j];
                                                entities.push(entity);
                                            }
                                            entitiesByTemplates[template.id] = gutil.unique(entities)
                                        } else {
                                            entitiesByTemplates[template.id] = ['All'];
                                        }
                                    }
                                }

                                $this.entitiesByTemplates = entitiesByTemplates;
                            } else {
                                var entitiesByTemplates = {};
                                if (entitiesByTemplates == null) {
                                    entitiesByTemplates = {};
                                }

                                for (var i = 0; i < props.templateAndEntitys.length; i++) {
                                    var template = props.templateAndEntitys[i].template;
                                    var entity = props.templateAndEntitys[i].entity;

                                    if (entitiesByTemplates[template] == null) {
                                        entitiesByTemplates[template] = [];
                                    }
                                    entitiesByTemplates[template].push(entity);
                                }

                                for (var template in entitiesByTemplates) {
                                    entitiesByTemplates[template] = gutil.unique(entitiesByTemplates[template]);
                                }

                                $this.entitiesByTemplates = entitiesByTemplates;
                            }

                            cb();
                        }.bind($this)
                    );
                }
            );
        }
    );
};

AddGenerator.prototype.files = function files() {
    this.showList();
    this.generateSpecific(this.entitiesByTemplates, false);
};
