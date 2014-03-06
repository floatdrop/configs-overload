/*global describe, it, beforeEach, afterEach*/
/*jshint expr:true*/

'use strict';

var path = require('path'),
    expect = require('chai').expect;

var FIXTURES_DIR = path.join(__dirname, 'fixtures'),
    ROOT_DIR = process.cwd();

describe('config', function () {
    beforeEach(function () {
        delete require.cache[require.resolve('..')];
        delete process.env.NODE_ENV;
        delete process.env.NODE_CONFIG_DIR;
        delete process.env.NODE_DEFAULT_ENV;
        process.chdir(FIXTURES_DIR);
    });

    afterEach(function () {
        process.chdir(ROOT_DIR);
    });

    it('should use env.NODE_ENV as config environment', function () {
        process.env.NODE_ENV = 'production';
        expect(require('..')().env).to.equal('production');
    });

    it('should use default environment if env.NODE_ENV is not defined', function () {
        expect(require('..')().env).to.equal('default');
    });

    it('should use env.NODE_CONFIG_DIR as config root', function () {
        process.env.NODE_ENV = 'development';
        process.env.NODE_CONFIG_DIR = path.join(FIXTURES_DIR, 'configs');
        expect(require('..')()).to.not.be.empty;
    });

    it('should use $CWD/configs as default config root', function () {
        process.env.NODE_ENV = 'development';
        expect(require('..')()).to.not.be.empty;
    });

    it('should use require() to load configs', function () {
        process.env.NODE_ENV = 'testing';
        require('..')();
        var modulePath = path.join(FIXTURES_DIR, 'configs', process.env.NODE_ENV, 'index.js');
        expect(require.cache).have.property(modulePath);
    });

    it('should merge default config with environment-based one', function () {
        process.env.NODE_ENV = 'production';
        expect(require('..')().defaultValue).to.be.true;
        expect(require('..')().env).to.equal('production');
    });

    it('should deep-merge configs', function () {
        process.env.NODE_ENV = 'stress';
        expect(require('..')()).to.eql({
            'env': 'stress',
            'defaultValue': true,
            'deep': {
                'deep': {
                    'deep': ['stress'],
                    'foo': 'bar',
                    'bar': 'foo'
                }
            }
        });
    });

    it('should keep work if default config is not exists', function () {
        process.env.NODE_ENV = 'production';
        process.env.NODE_CONFIG_DIR = path.join(FIXTURES_DIR, 'alter-configs');
        expect(function () {
            require('..')();
        }).to.not.throw(Error);
    });

    it('should not mask config errors', function () {
        process.env.NODE_ENV = 'errorous';
        process.env.NODE_CONFIG_DIR = path.join(FIXTURES_DIR, 'alter-configs');
        expect(function () {
            require('..')();
        }).to.throw(Error);
    });

    it('should not throw an error if environment config is not found', function () {
        process.env.NODE_ENV = 'production';
        process.env.NODE_CONFIG_DIR = path.join(FIXTURES_DIR, 'production');
        expect(require('..')()).to.be.eql({
            ok: true
        });
    });

    describe('.extend(args)', function () {
        it('should be function', function () {
            process.env.NODE_ENV = 'production';
            process.env.NODE_CONFIG_DIR = path.join(FIXTURES_DIR, 'configs');
            expect(require('..')()).to.have.property('extend');
            expect(require('..')().extend).to.be.instanceof(Function);
        });

        it('should return config itself', function () {
            process.env.NODE_ENV = 'production';
            process.env.NODE_CONFIG_DIR = path.join(FIXTURES_DIR, 'configs');
            var config = require('..')();
            expect(config.extend({})).to.be.equal(config);
        });

        it('should extend config from object', function () {
            process.env.NODE_ENV = 'production';
            process.env.NODE_CONFIG_DIR = path.join(FIXTURES_DIR, 'configs');
            var config = require('..')();
            config.extend({
                included: 'value'
            });
            expect(config).to.be.eql({
                'env': 'production',
                'defaultValue': true,
                'deep': {
                    'deep': {
                        'deep': ['default'],
                        'bar': 'foo'
                    }
                },
                'included': 'value'
            });
        });

        it('should extend config with regexp values', function () {
            process.env.NODE_ENV = 'production';
            process.env.NODE_CONFIG_DIR = path.join(FIXTURES_DIR, 'configs');
            var config = require('..')();
            config.extend({
                regexps: [/\t/]
            });
            expect(config).to.be.eql({
                'env': 'production',
                'defaultValue': true,
                'deep': {
                    'deep': {
                        'deep': ['default'],
                        'bar': 'foo'
                    }
                },
                'regexps': [/\t/]
            });
        });

        it('should extend config from directory', function () {
            process.env.NODE_ENV = 'production';
            process.env.NODE_CONFIG_DIR = path.join(FIXTURES_DIR, 'configs');
            var config = require('..')();
            config.extend(path.join(FIXTURES_DIR, 'extend-configs'));
            expect(config).to.be.eql({
                'env': 'production',
                'defaultValue': true,
                'deep': {
                    'deep': {
                        'deep': ['default'],
                        'bar': 'foo'
                    }
                },
                'extendDefault': 'exDefault',
                'extendOverwrite': 'overwritten'
            });
        });

        it('should be protect field', function () {
            process.env.NODE_ENV = 'extend';
            process.env.NODE_CONFIG_DIR = path.join(FIXTURES_DIR, 'extend-configs');
            expect(function () {
                require('..')();
            }).to.throw(Error, /`extend` property cannot be redefined in config/);
        });

        it('should extend config from file', function () {
            process.env.NODE_ENV = 'default';
            process.env.NODE_CONFIG_DIR = path.join(FIXTURES_DIR, 'extend-configs');
            var config = require('..')();
            config.extend(path.join(FIXTURES_DIR, 'extend-configs/justfile.js'));
            expect(config).to.be.eql({
                'extendOverwrite': 'notOverwritten',
                'extendDefault': 'exDefault',
                'im': 'just a file'
            });
        });

        it('should not fails with unknown path', function () {
            process.env.NODE_ENV = 'default';
            process.env.NODE_CONFIG_DIR = path.join(FIXTURES_DIR, 'extend-configs');
            var config = require('..')();
            expect(function () {
                config.extend(path.join(FIXTURES_DIR, 'well fuck'));
            }).to.not.throw(Error);
        });

        it('should fails with no path', function () {
            process.env.NODE_ENV = 'default';
            process.env.NODE_CONFIG_DIR = path.join(FIXTURES_DIR, 'extend-configs');
            var config = require('..')();
            expect(function () {
                config.extend();
            }).to.throw(Error);
        });

        it('should accept variable parameters', function () {
            process.env.NODE_ENV = 'production';
            process.env.NODE_CONFIG_DIR = path.join(FIXTURES_DIR, 'alter-configs');
            expect(require('..')().extend({
                a: '1'
            }, {
                b: '2'
            })).to.be.eql({
                env: 'production',
                a: '1',
                b: '2'
            });
        });

        it('should fails on extending with itself', function () {
            process.env.NODE_ENV = 'production';
            process.env.NODE_CONFIG_DIR = path.join(FIXTURES_DIR, 'alter-configs');
            expect(function () {
                var config = require('..')();
                config.extend(config);
            }).to.throw(Error, /cannot extend config with itself/);
        });
    });
});
