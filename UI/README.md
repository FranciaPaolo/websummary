# UI

This project is the frontend and was created with:
* React
* Bootstrap
* Mdjs Icons

## How to start and debug

Open the `config.js` file and setup the configuration.

In the project directory run:
`npm install`
Then: `npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Build

`npm run build`

Builds the app for production to the `build` folder.\
It correctly minify and bundles React in production mode and optimizes the build for the best performance.

## TODOs

Search in the Code for `TODO: ` comments that represent code to be complited.
Refer to Github for the open issues.

## Google Login

Open the client page and create a new client:
* https://console.developers.google.com/auth/clients
* set the Authorized redirect URIs: http://localhost:3000/logingoogle
* Save and note the ClientID and ClientSecret
* Change the config.js accordingly, LOGIN_GOOGLE_URL

Docs: https://developers.google.com/identity/openid-connect/

## Recaptcha

Open the admin page of the Recaptcha:
* https://www.google.com/recaptcha/admin
