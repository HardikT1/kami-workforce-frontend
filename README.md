# Kami Workforce Frontend Project

Welcome to the Kami Workforce Frontend! This is a web application built using the [Angular CLI](https://github.com/angular/angular-cli) version 19.0.6. Below you will find instructions on how to set up, run, and use the application.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Running the Application](#running-the-application)
5. [Building for Production](#building-for-production)
6. [Running Tests](#running-tests)
7. [Code Coverage](#code-coverage)
8. [Usage Instructions](#usage-instructions)

---

## Getting Started

This guide will help you set up and run the Angular project on your local machine for development and testing purposes.

---

## Prerequisites

Ensure you have the following software installed on your system:

- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- [Angular CLI](https://angular.io/cli) (use `npm install -g @angular/cli` to install)
- [Git](https://git-scm.com/)

---

## Installation

1. Clone the repository:
   ```bash
   https://github.com/HardikT1/kami-workforce-frontend.git

2. Navigate to the project directory:
   ```bash
   cd kami-workforce-frontend

3. Install dependencies:
   ```bash
   npm install

## Running the Application

1. Start the development server:
   ```bash
   npm run start

2. Start the development server:
   ```bash
   http://localhost:4200

3. The application will automatically reload if you make any changes to the source files.

## Building for Production

1. Run the build command:
   ```bash
   npm run build
   
2. The production-ready files will be generated in the dist/ directory.


## Running Tests
1. To execute the unit tests using Karma:
   ```bash
   npm run test

## Code Coverage
To generate a code coverage report for the unit tests:
1. Run the following command:
   ```bash
   npm run coverage

2. After the tests are complete, a coverage report will be generated in the coverage/ directory.

3. Open the index.html file in the coverage directory using your browser to view the detailed coverage report.

## Usage Instructions

After running the application, you can interact with the project using the following:

### Dashboard:
- Access the main features of the application.
- Includes navigation to different modules.

### Modules:
- Each module corresponds to specific features (e.g., **Posts**, **Albums**, **Photos**).

### API Integration:
- The application fetches data dynamically from backend APIs[https://jsonplaceholder.typicode.com/].

### Customizing:
- Modify any component or service to suit your requirements.
- Rebuild the application using `npm run build` after changes.
