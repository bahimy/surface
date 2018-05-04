# surface

## Legal notes
If there are any legal issues with content of the project, please send me a message. I will remove controversial items instantly.

## Project requirements
To work on a project you will need node.js and npm. Modules are exluded, so when deploying on another PC you can run "npm install --save-dev" in project's directory to restore them.

## Project structure
I believe the structure of the project is, by and large, self explanatory. You shuld be familiar with gulp to understand source files proccesing.

.
├── html
│   └── index.html
├── images
│   │
│   ...
├── js
│   ├── chunks                # scripts of this folder go to project build without any proccessing
│   │   │
│   │   ...
│   └── concat                # scripts in this folder aggregate into a single file
│       ├── slider.dia        # occasionally it can contain diagram to script with respective filename
│       ├── slider.js
│       ...
└── scss
    ├── base                  # global styles, thirdparty styles, mixins etc
    │   ├── _variables.scss   # main configuration file
    │   ...
    ├── blocks                # styles for respective blocks (filename represents block name)
    │   │
    │   ...
    └── index.scss            # entry point
