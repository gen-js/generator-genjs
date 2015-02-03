# generator-genjs

This is a Yeoman generator to create GenJS for code generation in javascript.

Commands :
* ```yo genjs``` : create a new GenJS project and after creation launch with : ```node main.js```
* ```yo genjs:bundles``` : download templates bundles

# Installation

```
npm install -g yo generator-genjs
```

# Create a GenJS project

* In an empty folder, create the GenJS project :
```
yo genjs
```

Answer the questions :
- name of the project
- version of the project
- base package
- project type :
  - "Blank project" with a sample model and sample templates
  - "Java sample project" to generate a Spring Data project for MongoDB

The GenJS project is created.

* Run the GenJS generator :
```
node main.js
```

You should have these directories :
```
[project]
   \- bundles      -> templates bundles
   \- data        
      \- global-variables.js -> global variables
      \- model.js            -> data model
   \- node_modules
   \- templates    -> templates
   \- out          -> generated files
   \- main.js
```

A sample model is already defined in ```model/model.js``` with these entities : book, author and publisher.

### Blank project
For "Blank project", you have sample templates in "templates" directory.
Some "yaml" files are generated.


### Java sample project
For "Java sample project", you have templates to generate a Java project with Spring Data for MongoDB.

If you have a mongodb database running, you can run the Java project like this :
```
cd out
mvn spring-boot:run
```

# Templates bundles

If Git is installed on your computer, you can download existing bundles :
```
yo genjs:bundles
```
, otherwise you can test GenJS by following the tutorial in the next chapter.

# Documentation

This chapter explained the role and syntax of each files of the GenJS project.

## Model

In the ```model/model.js``` the declaration of the entity ```Book``` :
```
var entities = {
  "book": {
    "attributes": {
      "title": {
        "type": "String"
      }
    } 
  }
}
```
The ```id``` and ```name``` properties are automatically added by GenJS for each entity and attribute. They are equals to the key name in the map.
```
var entities = {
  "book": {
    "id": "book",
    "name": "book",
    "attributes": {
      "title": {
        "id": "title",
        "name": title",
        "type": "[attribute type]"
      }
    } 
  }
}
```

## Template

Templates have the EJS syntax.

### Template generated for each entity

If the template is used for each entity, then the name of the template must contain one of these expressions :
- [name] : name of the entity (= entity.name)
- [name_a] : name of the entity with the first letter in lowercase
- [name_A] : name of the entity with the first letter in uppercase

### Template generated only once

If the template is only generated once time, you must not set expressions in the file name.

### Expressions in directories

```PPP``` folder name will be replaced by the base package name of the project.

### Expressions in templates of entities

#### ```entity```

The variable ```entity``` targets the data of one entity in the ```model.js``` file.

This ```entity``` variable is available only if the template name has the expression ```[name]```in its name.

#### ```entities```
For all templates, the variable ```entities``` targets the array which contains all entities of the ```model.js``` file.

### Lowercase and Uppercase

Strings value have these functions :
* str.a() : the first letter is in lowercase
* str.A() : the first letter is in uppercase
