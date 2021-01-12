# CPU Load Monitor

A humble CPU load monitoring app built in TypeScript, React, SASS and Node.js. The application implements a local server with a single GET endpoint where consumers can fetch last-minute data about current CPU average load from the local system.

This data is consumed by a convenient UI displaying CPU load time series and stats. The UI also supports editing the application monitoring settings.

## TL;DR
In a system provided with at least Node.js v12, install dependencies with `yarn`, then run `yarn serve` and open up a browser window pointing to [http://localhost:8080](http://localhost:8080). *Happy monitoring!*

## Setting up your environment
The minimum requirements for running this project, either on development or production mode, and its development scripts are `node v12.16.0` and `npm v.6.14.15`, or later versions. Probably this project will run seamlessly on older versions of `node` and `npm` but the use of the latest [LTS versions](https://nodejs.org/) is advised.

This project leverages [Create React App](https://github.com/facebook/create-react-app) (CRA) and other custom scripts for spawning dev environments, running builds and handling code optimisations. All interaction with CRA has been abstracted in custom scripts for your convenience.

### Installing dependencies
As a first step prior to spawn either a development environment or a production build, please run `yarn` (recommended) or `npm install` in the project root folder to pull all the required vendor dependencies.

## Building the CPU Monitoring App
Once all the project dependencies have been successfully installed (see _Installing dependencies_ above) you can build and consume the project simply by running `yarn serve` (or `npm run serve`) in your terminal console.

This will run the CRA `build` script under the hood to compile the UI layer. Moreover, it will spawn a Node.js instance serving as a web server for both the front-end and backend layers.

You can then check the application by pointing your browser to [http://localhost:8080](http://localhost:8080).

### Customising the server port in use
Some basic settings such as the server port in use can be configured by [editing by hand](server/settings.js) the `server/settings.js` file. As a general principle, you will probably want to to leave the default configured settings as is and the port number is the only setting you might want to update eventually, if needed.

## Firing up a development environment
In case you need to bootstrap the application in _dev mode_, a set of scripts leveraging the CRA built-in commands have been made available for your convenience.

Please note that dependencies need to be installed beforehand by running `yarn` or `npm i`.

### Bootstrapping the application in watch mode
Running the `yarn dev` command will bootstrap the backend server and will raise the UI application in _watch mode_, consuming the backend through a convenient proxy, so you can apply changes in the frontend layer and see the ourcome in real time straight from [http://localhost:3000](http://localhost:3000/).

### Customising the business logic settings
The UI is provided with a convenient settings udpate menu available by clicking on the button at the bottom. Nonetheless you can build the application with custom settings ahead of time by editing by hand the configuration values in the configuraiton manifest file at `src/settings/settings.configuration.ts`.

### Code linting and testing
The code in this application is audited with ESLint to ensure code consistency. Code functionality is surveilled by a comprehensive set of unit tests built on top of [Jest](https://jestjs.io/) and the [React Testing Library](https://testing-library.com/). The following commands have been made available for your convenience:

* `yarn test`: Launches the test runner (with interactive watch mode disabled though) and performs a single test run on both the UI frontend and the backend API implementation files. This command also conducts a comprehensive code coverage reporting (see below).
* `yarn test:ui`: Launches the test runner under interactive watch mode for the UI frontend application. It also lints all TypeScript files, reporting code quality issues if any. This is the preferred way when hacking into the frontend layer.
* `yarn test:server`: Executes the test runner (with interactive watch mode disabled though) for the backend server application.

#### Code coverage reports
[Jest](https://jestjs.io/) has been configured to generate a full code coverage report in HTML format on every time run of the `test` command. This coverage report can be found at `/coverage/lcov-report` after tests are run successfully.

At the time of this writing, **this application features a 100% code coverage**.

## Improvements and enhancements
Given the POC nature of this application, there's still a lot of room for improvement. A detailed rundown of all improvement and enhancement ideas is [available here](docs/TODO.md).

## Distributed under the MIT License

Copyright 2021 Pablo Deeleman

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.