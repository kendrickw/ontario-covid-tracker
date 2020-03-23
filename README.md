# Ontario COVID-19 Tracker

Ontario COVID-19 Tracker

## Prerequisites

To install node_modules:

```shell
yarn
```

## start development server

```shell
yarn run dev
```

## debug development server

Add `debugger;` statement in server code to set an initial breakpoint for ndb.

```shell
yarn run dev:debug
```

## start production server

```shell
yarn build
yarn start
```

## deploy to Google Cloud

Install google cloud SDK:

```shell
brew tap homebrew/cask
brew cask install google-cloud-sdk
```

This app require the following google cloud APIs:

- App Engine

Refer to [Setup Google Cloud APIs](#setup-google-cloud-apis) for more information.

To deploy: (Enable Billing if you haven't already)

```shell
gcloud auth login
gcloud app deploy --project [YOUR_PROJECT_ID]
```

To disable app (and stop billing):

- In GCP, goto 'App Engine'... 'Settings'... 'Disable application'
- In GCP, goto 'Billing'... 'Manage Billing'.... 'Disable billing'
