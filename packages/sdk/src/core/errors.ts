import type { PayheroErrorDetails } from '../types.js'

export class PayheroError extends Error {
  readonly details: PayheroErrorDetails

  constructor (message: string, details: PayheroErrorDetails = {}) {
    super(message)
    this.name = 'PayheroError'
    this.details = details
    Object.setPrototypeOf(this, PayheroError.prototype)
  }
}

export class PayheroValidationError extends PayheroError {
  constructor (message: string, details: PayheroErrorDetails = {}) {
    super(message, details)
    this.name = 'PayheroValidationError'
    Object.setPrototypeOf(this, PayheroValidationError.prototype)
  }
}

export class PayheroTransportError extends PayheroError {
  constructor (message: string, details: PayheroErrorDetails = {}) {
    super(message, details)
    this.name = 'PayheroTransportError'
    Object.setPrototypeOf(this, PayheroTransportError.prototype)
  }
}

export class PayheroApiError extends PayheroError {
  constructor (message: string, details: PayheroErrorDetails = {}) {
    super(message, details)
    this.name = 'PayheroApiError'
    Object.setPrototypeOf(this, PayheroApiError.prototype)
  }
}
