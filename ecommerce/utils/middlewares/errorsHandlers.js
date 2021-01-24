const config = require('../../config/index')
const boom = require('boom')
const debug = require('debug')('app:error')
const Sentry = require("@sentry/node");
const isRequestAjaxOrApi = require('../../utils/isRequestAjaxOrApi')

function withWErrorStack(err, stack) {
    if (config.dev) {
        return { ...err, stack } // Object.assign({}, err, stack)
    }
}

function logErrors(err, req, res, next) {
    Sentry.captureException(err);
    debug(err.stack)
    next(err)
}

function wrapErrors(err, req, res, next) {
    if (!err.isBoom) {
        next(boom.badImplementation(err))
    }

    next(err)
}

function clientErrorHandler(err, req, res, next) {
    const {
        output: { statusCode, payload}
    } = err

    // Catch error for AJAX request or if an error ocurrs while streaming
    if (isRequestAjaxOrApi(req) || res.headersSent) {
        res.status(statusCode).json(withWErrorStack(payload, err.stack))
    } else {
        next(err)
    }
}

function errorHandler(err, req, res, next) {
    const {
        output: { statusCode, payload}
    } = err


    res.status(statusCode)
    res.render("error", withWErrorStack(payload, err.stack))
}


Sentry.init({
  dsn: `${config.sentryDns}/${config.sentryId}`
});

module.exports = {
    logErrors,
    wrapErrors,
    clientErrorHandler,
    errorHandler
}