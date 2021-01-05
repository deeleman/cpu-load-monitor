# CPU Load Monitor

A humble CPU load monitoring app built in TypeScript, React and Node.js. The application implements a server with a single endpoint where consumers can fetch last-minute data from the current CPU average load in the local system, plus a convenient UI where users can visualize CPU load time series and stats and even tweak the application configuration.

## Setting up your environment
The minimum requirements for running this project, either on development or production mode, and its development scripts are `node v12.16.0` and `npm v.6.14.15`, or later versions. Probably this project will run seamlessly on older versions of `node` and `npm` but we recommend using the latest [LTS versions](https://nodejs.org/).

This project relies on [Create React App](https://github.com/facebook/create-react-app) and other custom scripts for spawning dev environments, running builds and handling code optimisations. All interaction with Create React App has been abstracted in custom scripts for your convenience.

### Installing dependencies
As a first step to spawn a development environment or production build, please run either `yarn` (recommended) or `npm install` to pull all the required dependencies for this project.

## Available Scripts

In the root project directory, you can run:

### `yarn start`

Runs the UI app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits and you will also see any lint errors in the console.

### `yarn start:server`

Fires up a Node.js server instance (whose source files are available in the `/server` folder) to spawn the backend API required to feed the UI. The backend can operate as an standalone application, hence this script.

The backend server is configured to serve any static site made available in the `/build` folder as well.

### `yarn dev`

This convenient script combines the concurrent execution of `yarn start:server` and `yarn start:server` and will be the preferred way to bootstrap the entire application for development purposes.

### `yarn build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

### `yarn build:ci`

Performs the same operations as `yarn build` and initializes the backend server in production mode taking care of both the data API and the UI frontend application as well.

This is the preferred hook script for CI/CD servers (Netlify, Azure, Vercel, etc).

### `yarn test`

Launches the test runner under interactive watch mode for the UI frontend application.

### `yarn test:server`

Launches the test runner (with interactive watch mode disabled though) for the backend server application.

### `yarn test:all`

Launches the test runner (with interactive watch mode disabled though) and performs a single test run on both the UI frontend and the backend API implementation files.

### Code coverage reports
[Jest](https://jestjs.io/) has been configured to generate a full code coverage report in HTML format on every time run of the `test` command. This coverage report can be found at `/coverage/lcov-report` after tests are run successfully.

## Distributed under the MIT License

Copyright 2020 Pablo Deeleman

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.