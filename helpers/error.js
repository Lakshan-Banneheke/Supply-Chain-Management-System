class ExtendableError extends Error {
    constructor(message) {
        if (new.target === ExtendableError) {
            throw new TypeError('Abstract class "ExtendableError" cannot be instantiated directly.');
        }
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        Error.captureStackTrace(this, this.contructor);
    }
}

/**
 * Error class for 400: Bad Request
 * @param  {string} m Error message
 */
class BadRequest extends ExtendableError {
    constructor(m) {
        if (arguments.length === 0) {
            super('bad request');
        } else {
            super(m);
        }
    }
}

module.exports.BadRequest = BadRequest;

