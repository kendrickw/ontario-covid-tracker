# React Starter Kit

React Starter Kit

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

## deploy to Microsoft Azure

In Azure:

- create Resource Group `<group-name>`
- create App Service `<app-name>`

In the Azure Cloud Shell:

```shell
az webapp deployment user set --user-name <username> --password <password>
az webapp deployment source config-local-git --name <app-name> --resource-group <group-name>
```

In the local terminal, add the newly craeted remote git URL to your local git repository:

```shell
git remote add azure https://<username>@<app-name>.scm.azurewebsites.net/<app-name>.git
git push azure master
```

When asked for the password, specify the password created when setting up your deployment user.
