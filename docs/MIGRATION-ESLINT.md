# Migration from TSLINT to ESLINT #

## install eslint schematics ##

```bash
npx ng add @angular-eslint/schematics
```

## run the schematics ##
```bash
npx ng g @angular-eslint/schematics:convert-tslint-to-eslint <project-name>
```

## Add configuration ##

### package.json ###

```json
{
  ...
  "devDependencies": {
    "@nationalbankbelgium/eslint-config": "^12.0.0",
    ...
    "eslint-config-prettier": "^8.8.0",
    "eslint-plugin-sonarjs": "^0.06.0",
    ...
  }
  ...
}
``` 

### .eslintrc.json ###

```json
{
	"root": true,
	"extends": ["@nationalbankbelgium", "prettier"],
	"ignorePatterns": ["src/assets/**/*"],
	"overrides": [
		{
			"files": ["*.ts"],
			"plugins": ["eslint-plugin-sonarjs"],
			"extends": ["plugin:sonarjs/recommended"]
		},
		{
			"files": ["*.ts"],
			"excludedFiles": ["*.spec.ts"],
			"rules": {
				"@angular-eslint/component-selector": [
					"error",
					{
						"prefix": ["app", "demo", "showcase", "stark"],
						"style": "kebab-case",
						"type": "element"
					}
				],
				"@angular-eslint/directive-selector": [
					"error",
					{
						"prefix": ["app", "demo", "showcase"],
						"style": "camelCase",
						"type": "attribute"
					}
				]
			}
		}
	]
}
```

### Adapt the scripts in package.json ###
```json
	<!-- to be changed -->
	"lint": "npm run lint-es && npm run lint-css",
	
	<!-- to be added -->
	"lint-es": "ng lint",
	"lint-es:fix": "ng lint --fix",

	<!-- to be removed -->
	"lint-ts" : ...
```

### Set the lodash version ###
```json
	"@types/lodash":"4.14.195",
```

## Remove TSLint configuration ##

remove the following files:
- tslint.json

## run the lint command ##
```bash
npm run lint-es:fix
```