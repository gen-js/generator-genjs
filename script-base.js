'use strict';
var path = require('path'),
    util = require('util'),
    yeoman = require('yeoman-generator'),
    gutil = require('gutil');
var GenJS = require('D:/utilisateurs/luchabou/git/genjs/genjs/lib/genjs');

module.exports = Generator;

function Generator() {
    yeoman.generators.NamedBase.apply(this, arguments);
    this.env.options.appPath = this.config.get('appPath') || 'src/main/webapp';
}

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.loadGenJS = function files() {

    this.genJS = new GenJS({
        dir: process.cwd(),
        config: "./config/config.js",
        context: "./config/context.js",
        helpers: "./config/helpers.js",
        bundles: "./config/bundles.js",
        filters: "./config/filters.js",
        stereotypes: ['./model/stereotypes.js'],
        entities: ["./model/entities.js"],
        links: ["./model/entities_links.js"],
        templates: ["./model/templates.js"],
        templatesDirs: ['./templates'],
        getGenerations: ["./config/getGenerations.js"]
    });
    this.genJS.loadFiles();

};

Generator.prototype.generate = function files(overwrite, isWatching) {
    var entitiesByTemplates = this.config.get('entitiesByTemplates');
    if (entitiesByTemplates == null) {
        return;
    }
    this.generateSpecific(entitiesByTemplates, overwrite, isWatching);
}

Generator.prototype.generateSpecific = function files(entitiesByTemplates, overwrite, isWatching) {
    if(overwrite == null) {
        overwrite = false;
    }
    if(isWatching == null) {
        isWatching = false;
    }

    var genJS = this.genJS;

    var entitiesByTemplates = this.config.get('entitiesByTemplates');
    if(entitiesByTemplates == null) {
        return;
    }
    var generations = [];

    for(var templateId in entitiesByTemplates) {
        var template = gutil.by(this.genJS.templates,"id",templateId)[0];
        var entitiesForTemplate = entitiesByTemplates[templateId];
        var entities = [];
        var hasAll = false;
        for(var i=0; i<entitiesForTemplate.length; i++) {
            if(entitiesForTemplate[i] == 'All') {
                hasAll = true;
            }
        }
        if(hasAll) {
            entities = genJS.entities;
        } else {
            gutil.each(entitiesByTemplates[templateId], function (entityId) {
                gutil.addAll(entities, gutil.by(genJS.entities, "id", entityId));
            });
        }
        generations.push({
            templates: [template],
            entities: entities
        });
    }

    this.genJS.main({
        config:{
            overwrite: overwrite,
            isWatching: isWatching
        },
        generations: generations
    });
};

Generator.prototype.isSpecificTemplateForEntity = function(template) {
    var isSpecificTemplateForEntity = false;
    if(template.generatedName != null) {
        if (template.generatedName.indexOf('XXX') != -1) {
            isSpecificTemplateForEntity = true;
        }
        if (template.generatedName.indexOf('Xxx') != -1) {
            isSpecificTemplateForEntity = true;
        }
        if (template.generatedName.indexOf('xxx') != -1) {
            isSpecificTemplateForEntity = true;
        }
    }
    if(template.generatedPackage != null) {
        if (template.generatedPackage.indexOf('XXX') != -1) {
            isSpecificTemplateForEntity = true;
        }
        if (template.generatedPackage.indexOf('Xxx') != -1) {
            isSpecificTemplateForEntity = true;
        }
        if (template.generatedPackage.indexOf('xxx') != -1) {
            isSpecificTemplateForEntity = true;
        }
    }
    return isSpecificTemplateForEntity;
}

Generator.prototype.getSampleGenerated = function(template, entityName) {
    var out = '';
    if(template == null) {
        return out;
    }
    if(template.stereotypes == null || template.stereotypes.length == 0) {
        out += '<no stereotype>  ';
    } else {
        var concatStereotypes = gutil.concat(template.stereotypes, ', ', '', '', function (stereotype) {
            return stereotype;
        });
        /*
        var tabs = '';
        for (var j = 0; j < 16 - concatStereotypes.length; j++) {
            tabs += ' ';
        }
        out += concatStereotypes + tabs + ' ';
        */
        out += concatStereotypes + ' : ';
    }
    var sampleGeneratedPackage = template.generatedPackage;
    if(sampleGeneratedPackage != null) {
        if (entityName != null) {
            sampleGeneratedPackage = sampleGeneratedPackage.replaceAll('XXX', entityName.A());
            sampleGeneratedPackage = sampleGeneratedPackage.replaceAll('Xxx', entityName.A());
            sampleGeneratedPackage = sampleGeneratedPackage.replaceAll('xxx', entityName.a());
        }
        sampleGeneratedPackage = sampleGeneratedPackage.replaceAll('PPP', this.genJS.config.packageBase);
        out += sampleGeneratedPackage + '.';
    }
    var sampleGeneratedName = template.generatedName;
    if(sampleGeneratedName != null) {
        if (entityName != null) {
            sampleGeneratedName = sampleGeneratedName.replaceAll('XXX', entityName.A());
            sampleGeneratedName = sampleGeneratedName.replaceAll('Xxx', entityName.A());
            sampleGeneratedName = sampleGeneratedName.replaceAll('xxx', entityName.a());
        }
        out += sampleGeneratedName;
    }
    return out;
}

Generator.prototype.showList = function files() {
    console.log('Generation of :');
    var entitiesByTemplates = this.config.get('entitiesByTemplates');
    if(entitiesByTemplates == null || Object.keys(entitiesByTemplates).length == 0) {
        console.log('=> no file to generate');
        return;
    }
    var generateds = [];
    for(var templateId in entitiesByTemplates) {
        var template = gutil.by(this.genJS.templates,'id',templateId)[0];
        var entities = entitiesByTemplates[templateId];
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            generateds.push(this.getSampleGenerated(template, entity));
        }
    }
    generateds = gutil.sort(gutil.unique(generateds));
    for(var i=0; i<generateds.length; i++) {
        console.log(generateds[i]);
    }
};

Generator.prototype.getGenChoices = function files() {
    var genChoices = [{
        value: "All",
        name: "All",
        checked: false
    }];
    var entitiesByTemplates = this.config.get('entitiesByTemplates');
    if(entitiesByTemplates == null || Object.keys(entitiesByTemplates).length == 0) {
        return genChoices;
    }
    for(var templateId in entitiesByTemplates) {
        var template = gutil.by(this.genJS.templates,'id',templateId)[0];
        if(this.isSpecificTemplateForEntity(template)) {
            var entityIds = entitiesByTemplates[templateId];
            for (var i = 0; i < entityIds.length; i++) {
                var entityId = entityIds[i];
                genChoices.push({
                    value: {template: templateId, entity: entityId},
                    name: this.getSampleGenerated(template, entityId),
                    checked: false
                });
            }
        } else {
            genChoices.push({
                value: {template: templateId, entity: 'All'},
                name: this.getSampleGenerated(template),
                checked: false
            });
        }
    }
    return genChoices;
};
