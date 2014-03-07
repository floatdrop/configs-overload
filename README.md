# configs-overload 
[![NPM Version](https://badge.fury.io/js/configs-overload.png)](https://npmjs.org/package/configs-overload) [![Build Status](https://travis-ci.org/floatdrop/configs-overload.png?branch=master)](https://travis-ci.org/floatdrop/configs-overload) [![Coverage Status](https://coveralls.io/repos/floatdrop/configs-overload/badge.png?branch=master)](https://coveralls.io/r/floatdrop/configs-overload) [![Dependency Status](https://gemnasium.com/floatdrop/configs-overload.png)](https://gemnasium.com/floatdrop/configs-overload)

> Load configs with ease

This package helps you to organize your configurations and load them on per-environment basis. Also it have default file, which reduce amount of repetative key-value pairs between configuration files. 

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
var config = require('configs-overload')('./configs', { env: 'production' });
```

`configs-overoload` will load configs from `default.js` and extend them with object loaded from `production.js`.

## API

### configs-overload([directory, options])

#### directory

Type: `String` Default: `path.join(process.cwd(), 'configs')`

Path to directory with config files.

#### options

Type: `Object`

 * `defaultEnv` - name of default environment, which will be overloaded with current environment (default: `process.env.NODE_DEFAULT_ENV` or `default`)
 * `env` - Environment name which will override `defaultEnv` (default: `process.env.NODE_ENV` or `defaultEnv`).

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

The MIT License (MIT)

Copyright (c) 2014 Vsevolod Strukchinsky and other [contributors](https://github.com/floatdrop/configs-overload/blob/master/CONTRIBUTORS.md)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


