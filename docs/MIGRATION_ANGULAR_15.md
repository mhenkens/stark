# Upgrade to Angular 14

This guide will help you to upgrade your Angular application to Angular 14. It is recommended to upgrade to Angular 12 first before upgrading to Angular 14.

## Before you start

make sure you use node 20

### Update dependencies

```json
	/* from */
	"@angular/flex-layout": "^14.0.0-beta.41"
	/* to */
	"@angular/flex-layout": "^15.0.0-beta.42",

	/* from */
	"@nationalbankbelgium/stark-core": "12.0.0-beta.1",
	"@nationalbankbelgium/stark-rbac": "12.0.0-beta.1",
	"@nationalbankbelgium/stark-ui": "12.0.0-beta.1",

	/* to */

	"@nationalbankbelgium/stark-core": "12.0.0-beta.2",
	"@nationalbankbelgium/stark-rbac": "12.0.0-beta.2",
	"@nationalbankbelgium/stark-ui": "12.0.0-beta.2",
```

### devDependencies

```json
	/* from */
	"@nationalbankbelgium/stark-build": "12.0.0-beta.0",
	"@nationalbankbelgium/stark-testing": "12.0.0-beta.0",

	/* to */
	"@nationalbankbelgium/stark-build": "12.0.0-beta.1",
	"@nationalbankbelgium/stark-testing": "12.0.0-beta.1",
```

### install dependencies

```shell
npm install
```

### Commit your change before executing angular schematics

Because the schematics want to run on clean workspace, you must commit your changes before executing the following command

```shell
npx ng update @angular/cli@15 @angular/core@15 @angular/material@15
```

### update your tsconfig.ts

```json
{
  "extends": "@nationalbankbelgium/code-style/tsconfig/4.9.x/ng15",
  "compilerOptions": {
    "baseUrl": "./src",
    "outDir": "./dist",
    "typeRoots": [
      "./node_modules/@types",
      "./node_modules/@nationalbankbelgium/stark-build/typings",
      "./node_modules/@nationalbankbelgium/stark-ui/typings"
    ],
    "paths": {}
  },
  "exclude": ["node_modules", "dist", "src/assets"]
}
```

### update eslint-config in package.json

```json
...
"devDependencies": {
	...
	"@nationalbankbelgium/eslint" : "^15.0.1",
	...
}
...
```

### test

- remove `node_module` directory
- remove `package-lock.json` file
- run `npm i`
- run `npm run lint`
- run `npm run test`
- run `npm run start`
