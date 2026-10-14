type ErrorBody = {
  code?: string
  message?: string
}

export class ApiError extends Error {
  readonly code: string
  readonly status: number

  constructor(code: string, message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }

  static fromResponse(response: Response, body?: ErrorBody): ApiError {
    const code = body?.code?.trim() || 'HTTP_ERROR'
    const message =
      body?.message?.trim() || 'Something went wrong. Please try again.'
    return new ApiError(code, message, response.status)
  }
}
