# KakooFrontEnd

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.1.

# Installation Steps
1) install Node and NPM (NPM 5.6.0 or higher version ) from the official site : `https://nodejs.org/en/download/`
2) install angular cli (1.7.1) globally by using the command : npm install -g @angular/cli@1.7.1
3) go to the directory where you cloned the project and run the following commands:
    1- npm install
    2- npm install -g @angular/cli@1.7.1

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `outDir` directory. Use the `-prod` flag for a production build.
When you build the project a folder 'outDir' will be generated , outside of the project , there you will find al the assets used in the application and also the API URL that you can change  (see next paragraph)

## API
 the link to the API is in the folder `assets/environments/`
 in `environments.prod.ts` we have the link to the Api used in production mode.
 in `environments.ts ` the link to API used in development mode .





## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

