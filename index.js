module.exports = process.env.CONFIGS_OVERLOAD_COVERAGE ?
    require('./lib-cov') :
    require('./lib');
