export class PayheroError extends Error {
  constructor (message, details = {}) {
    super(message)
    this.name = 'PayheroError'
    this.details = details
  }
}

export class PayheroValidationError extends PayheroError {
  constructor (message, details = {}) {
    super(message, details)
    this.name = 'PayheroValidationError'
  }
}

export class PayheroTransportError extends PayheroError {
  constructor (message, details = {}) {
    super(message, details)
    this.name = 'PayheroTransportError'
  }
}

export class PayheroApiError extends PayheroError {
  constructor (message, details = {}) {
    super(message, details)
    this.name = 'PayheroApiError'
  }
}
