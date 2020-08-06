[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/Cvmcosta/ltijs-demo-server)

<div align="center">
	<br>
	<br>
	<a href="https://cvmcosta.github.io/ltijs"><img width="360" src="https://raw.githubusercontent.com/Cvmcosta/ltijs/987de79b9a3d529b1b507baa7b7a95d32ab386c2/docs/logo-300.svg?sanitize=true"></img></a>
  <a href="https://site.imsglobal.org/certifications/coursekey/ltijs"​ target='_blank'><img width="80" src="https://www.imsglobal.org/sites/default/files/IMSconformancelogoREG.png" alt="IMS Global Certified" border="0"></img></a>
</div>


# Ltijs Demo Server

> Ltijs v5 demo server

### Usage

- Download or clone the repo

- Setup `.env` file with the relevant variables

  ```
  DB_HOST=localhost
  DB_NAME=ltimoodle
  DB_USER=user
  DB_PASS=pass
  LTI_KEY=LTIKEY
  ```
  *DB_USER and DB_PASS are not required*

- Run `npm install`

- Run `npm start` 

### Usage on gitpod.io

Open https://gitpod.io/#https://github.com/Cvmcosta/ltijs-demo-server to start this application on Gitpod.

The gitpod configuration starts a local database server.

Use `gp env` to set the environment variables once:

```
eval $(gp env -e DB_HOST=localhost DB_NAME=ltimoodle LTI_KEY=JB3LabPQP9tX4jw4XhkqUEi8Vu7UbzmG)
```

The environment variables will be stored to your local container and retrieved afterwards. Choose your own LTI_KEY.

The application can be started using `npm start` in the terminal.

Execute `gp url 3000` in a new terminal to retrieve the base URL.

### React application

 The code for the react application used with this project can be found [here](https://github.com/Cvmcosta/ltijs-demo-client).