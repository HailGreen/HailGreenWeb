# HailGreenWeb

![](https://img.shields.io/badge/language-Java%20JavaScript-green.svg)![](https://img.shields.io/badge/IDE-WebStorm%20Idea-green.svg)

## Introduction 
This project is called GreenMedia. It is the assignment of the Intelligent Web of team *HailGreen*.



## Development Environment

* Node.js: version >= V10.15.0
* MongoDB: version = V4.2.5



## Installation

### Node.js

  1. Download [node.js](https://nodejs.org/en/) from the official website.<br>
  2. Install node.js.  In terminal, run  `npm -v ` and `node -v` .
      If it shows version number. Install success.

### Dependencies

  1. Go into folder `GreenMedia`
  2.  run `npm install`

###Database Configuration 

  1. Download [MongoDB](https://www.mongodb.com/download-center/community) from the official website.

  2. Before start the project,  **make sure you have run mongodb server**
    ```shell
    sudo <path to your mongo instance>/bin/mongod --dbpath /data/db  --port 27017 
    ```
    
  3. Init database

     Execute the script file in root path`initDatabase` in database tool

     

## Run project
Open Node.js project path `/GreenMedia` in **webstorm**

Run file `/bin/www`

Open URL in browser: https://localhost:3000/
