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

    var entitiesByStereotypes = {};
    for (var i = 0; i < this.genJS.entities.length; i++) {
        var entity = this.genJS.entities[i];
        if (entity.stereotypes == null) {
            if (entitiesByStereotypes['<no stereotype>'] == null) {
                entitiesByStereotypes['<no stereotype>'] = [];
            }
            entitiesByStereotypes['<no stereotype>'].push(entity);
        } else {
            for (var j = 0; j < entity.stereotypes.length; j++) {
                var stereotype = entity.stereotypes[j];
                if (entitiesByStereotypes[stereotype] == null) {
                    entitiesByStereotypes[stereotype] = [];
                }
                entitiesByStereotypes[stereotype].push(entity);
            }
        }
    }
    this.entitiesByStereotypes = entitiesByStereotypes;

    var entityStereotypesChoices = [{
        value: "All",
        name: "All",
        checked: false
    }];
    for (var entityStereotype in entitiesByStereotypes) {
        entityStereotypesChoices.push({
            value: entityStereotype,
            name: entityStereotype,
            checked: false
        });
    }

    var entitiesChoices = [];
    for (var i = 0; i < this.genJS.entities.length; i++) {
        var entity = this.genJS.entities[i];
        entitiesChoices.push({
            value: entity.id,
            name: entity.id,
            checked: false
        });
    }

    var entitiesForSelectedStereotypes = [];
    var selectEntities = function (entityStereotypes, entities) {
        // sample entity to display sample generated name for each entity with XXX in their names
        var entity = null;
        if(entities != null) {
            entity = entities[0];
        }

        var entitiesChoices = [{
            value: "All",
            name: "All",
            checked: false
        }];

        if (entityStereotypes == null) {
            return entitiesChoices;
        }
        if (entityStereotypes == "All") {
            entityStereotypes = Object.keys(entitiesByStereotypes);
        }

        var entities = [];
        for(var i=0; i<entityStereotypes.length; i++) {
            var entityStereotype = entityStereotypes[i];
            if(entityStereotype == '<no stereotype>') {
                for(var j=0; j<genJS.entities.length; j++) {
                    var entity = genJS.entities[j];
                    if(entity.stereotypes == null || entity.stereotypes.length == 0) {
                        entities.push(entity);
                    }
                }
            } else {
                gutil.addAll(entities, gutil.by(genJS.entities, 'stereotypes', entityStereotype));
            }
        }
        entities = gutil.unique(entities);
        entitiesForSelectedStereotypes = entities;

        for(var i=0; i<entities.length; i++) {
            var entity = entities[i];
            entitiesChoices.push({
                value: entity.id,
                name: entity.id,
                checked: false
            });
        }
        return entitiesChoices;
    }

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

    var templateStereotypesChoices = [{
        value: "All",
        name: "All",
        checked: false
    }];
    for (var templateStereotype in templatesByStereotypes) {
        templateStereotypesChoices.push({
            value: templateStereotype,
            name: templateStereotype,
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

    var templatesForSelectedStereotypes = [];
    var selectTemplates = function (templateStereotypes, entities) {
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

        if (templateStereotypes == null) {
            return templatesChoices;
        }
        if (templateStereotypes == "All") {
            templateStereotypes = Object.keys(templatesByStereotypes);
        }

        var templates = [];
        for(var i=0; i<templateStereotypes.length; i++) {
            var templateStereotype = templateStereotypes[i];
            if(templateStereotype == '<no stereotype>') {
                for(var j=0; j<genJS.templates.length; j++) {
                    var template = genJS.templates[j];
                    if(template.stereotypes == null || template.stereotypes.length == 0) {
                        templates.push(template);
                    }
                }
            } else {
                gutil.addAll(templates, gutil.by(genJS.templates, 'stereotypes', templateStereotype));
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

    // Entities stereotypes
    $this.prompt([
            {
                type: 'checkbox',
                name: 'entityStereotypes',
                message: 'Entities stereotypes',
                default: false,
                choices: entityStereotypesChoices
            }
        ],
        function(props) {
            $this.entityStereotypes = props.entityStereotypes;

            // entities
            $this.prompt([
                    {
                        type: 'checkbox',
                        name: 'entities',
                        message: 'Entities',
                        default: false,
                        choices: selectEntities($this.entityStereotypes, $this.genJS.entities)
                    }
                ],
                function (props) {
                    if (props.entities == 'All') {
                        $this.entities = gutil.all(genJS.entities, "id");
                    } else {
                        $this.entities = props.entities;
                    }

                    // stereotypes
                    $this.prompt([
                            {
                                type: 'checkbox',
                                name: 'templateStereotypes',
                                message: 'Templates group',
                                default: false,
                                choices: templateStereotypesChoices
                            }
                        ],
                        function (props) {
                            $this.templateStereotypes = props.templateStereotypes;

                            // templates
                            $this.prompt([
                                    {
                                        type: 'checkbox',
                                        name: 'templateAndEntitys',
                                        message: 'Templates',
                                        default: false,
                                        choices: selectTemplates($this.templateStereotypes, $this.entities)
                                    }
                                ],
                                function (props) {
                                    if (props.templateAndEntitys == 'All') {
                                        var entitiesByTemplates = $this.config.get('entitiesByTemplates');
                                        if (entitiesByTemplates == null) {
                                            entitiesByTemplates = {};
                                        }

                                        if ($this.entities.length > 0) {
                                            for (var i = 0; i < templatesForSelectedStereotypes.length; i++) {
                                                var template = templatesForSelectedStereotypes[i];
                                                var entities = entitiesByTemplates[template];
                                                if (entities == null) {
                                                    entities = [];
                                                }
                                                for (var j = 0; j < $this.entities.length; j++) {
                                                    var entity = $this.entities[j];
                                                    entities.push(entity);
                                                }
                                                entitiesByTemplates[template.id] = gutil.unique(entities)
                                            }
                                        }

                                        console.log(entitiesByTemplates);
                                        $this.config.set('entitiesByTemplates', entitiesByTemplates);
                                        $this.config.save();
                                    } else {
                                        var entitiesByTemplates = $this.config.get('entitiesByTemplates');
                                        if (entitiesByTemplates == null) {
                                            entitiesByTemplates = {};
                                        }

                                        for (var i = 0; i < props.templateAndEntitys.length; i++) {
                                            var template = props.templateAndEntitys[i].template;
                                            var entities = entitiesByTemplates[template];
                                            if (entities == null) {
                                                entities = [];
                                            }
                                            for (var j = 0; j < $this.entities.length; j++) {
                                                var entity = $this.entities[j];
                                                entities.push(entity);
                                            }
                                            entitiesByTemplates[template] = gutil.unique(entities);
                                        }

                                        for (var template in entitiesByTemplates) {
                                            entitiesByTemplates[template] = gutil.unique(entitiesByTemplates[template]);
                                        }

                                        $this.config.set('entitiesByTemplates', entitiesByTemplates);
                                        $this.config.save();
                                    }

                                    cb();
                                }.bind($this)
                            );
                        }
                    );
                }
            );
        }
    );
};

AddGenerator.prototype.files = function files() {
    this.showList();
    this.generate(false,false);
};
