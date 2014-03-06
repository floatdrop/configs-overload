# configs-overload [![Build Status](https://travis-ci.org/floatdrop/configs-overload.png?branch=master)](https://travis-ci.org/floatdrop/configs-overload)
> Load configs with ease

## Installation

`npm install configs-overload`

## Example

Consider, you have directory with following structure:

```
.
└── configs
    ├── default.js
    ├── development.js
    ├── production.js
    ├── stress.json
    └── testing
        └── index.js
```

And this code in application:

```js
var config = require('configs-overload')('/configs', { env: 'production' });
```

`configs-overoload` will load configs from `default.js` and overwrite them by fileds from `production.js`.

## API

### configs-overload([directory, options])

#### directory

Type: `String` Default: `path.join(process.cwd(), 'configs')`

Path to directory with config files.

#### options

Type: `Object`

 * `defaultEnv` - name of default environment, which will be overloaded with current environment (default: `default`)
 * `env` - Environment name which will override `defaultEnv`.

## Environment variables

 * `NODE_CONFIG_DIR` - default directory, if it not specified in options.
 * `NODE_DEFAULT_ENV` - "default" environment name
 * `NODE_ENV` - environment name

## Methods

* `extend(...objects)` - loads configs in directory over already loaded. Object can be:
    * `string` with path to file - require(path) and extend config with result.
    * `string` with path to directory - load configs directory in directory in default order.
    * `object` - extend config with object.

## License

MIT

