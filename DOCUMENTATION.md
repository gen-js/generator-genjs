# generator-genjs

This is a Yeoman generator to create GenJS for code generation in javascript.

# Installation

```
npm install -g yo generator-genjs
```

# Projects organization

The generated project will be in the root directory which contains the generated files.

This generation project will be in the subdirectory ```genjs``` which contains the templates and the model to generate the files.

```
[project]
\- ... files of the generated project
\- genjs
   \- ... files of the generation project
```

# Create a new project

Create and go to the directory with the name of your project :
```
mkdir [project]
cd [project]
```
, replace ```[project]``` by the name of the project

Create and go to the subdirectory which contains the GenJS generation project :
```
mkdir genjs
cd genjs
```

Create the GenJS project :
```
yo genjs
```

Answer the questions :
- name of the project
- version of the project
- base package

The GenJS project is created.

You should have these directories :
```
[project]
\- genjs
   \- config
   \- model
   \- templates
   \- node_modules
   \- gen.js
   \- main.js
```

Run the GenJS generator :
```
node main.js
```

# Bundles

* Launch the ```genjs:bundles``` subgenerator :
```
cd genjs
yo genjs:bundles
```
* Select the bundle of your choice : 
=> these bundles are on Github : https://github.com/gen-js-bundles
