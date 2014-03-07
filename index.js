'use strict';

var path = require('path'),
    extend = require('node.extend'),
    fs = require('fs');

var isDirectory = function (path) {
    try {
        return fs.statSync(path).isDirectory();
    } catch (e) {
        return false;
    }
};

var softRequire = function (entity) {
    if (!fs.existsSync(entity)) {
        return {};
    }
    return require(entity);
};

/**
 * Merges config with configs in passed config directory
 *
 * @param {String} directory
 * @param {String} defaultEnv
 * @param {String} environment
 * @returns {*} config
 */
var loadDirectory = function (directory, defaultEnv, environment) {
    defaultEnv = defaultEnv || 'default';
    environment = environment || defaultEnv;

    var config = Object.create({}, /** @lends config */ {
        extend: {
            get: function () {
                return configExtend.bind(config);
            },
            enumerable: false,
            set: function () {
                throw new Error('`extend` property cannot be redefined in config');
            }
        }
    });

    /**
     *
     * Extends config object with merged in arguments.
     *
     * Arguments can be:
     *  String with path to file - file will be required and config config extended with it.
     *  String with path to directory - directory will be loaded by default rules.
     *  Object - config will be extended with object.
     *
     * @returns {Object} with extended config
     */
    var configExtend = function () {
        if (!arguments.length) {
            throw new Error('object/path in extend was not specified');
        }

        Array.prototype.slice.call(arguments).forEach(configExtendWith.bind(this));
        return this;
    };

    var configExtendWith = function (entity) {
        if (entity === this) {
            throw new Error('cannot extend config with itself');
        }
        if (typeof entity === 'string' || entity instanceof String) {
            entity = isDirectory(entity) ? loadDirectory(entity, defaultEnv, environment) : softRequire(entity);
        }
        extend(true, this, entity);
    };

    return [defaultEnv, environment].reduce(function (config, name) {
        try {
            extend(true, config, require(path.join(directory, name)));
        } catch (e) {
            if (e && e.code !== 'MODULE_NOT_FOUND' && defaultEnv !== name) {
                throw e;
            }
        }
        return config;
    }, config);
};

module.exports = function (configsDirectory, options) {
    configsDirectory = configsDirectory || process.env.NODE_CONFIG_DIR;

    options = options || {};
    options.defaultEnv = options.defaultEnv || process.env.NODE_DEFAULT_ENV;
    options.env = options.env || process.env.NODE_ENV;

    return loadDirectory(configsDirectory, options.defaultEnv, options.env);
};
