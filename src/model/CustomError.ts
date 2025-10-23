// src/model/CustomError.ts
export class CustomError extends Error {
    code?: string
    httpStatus?: number

    constructor(code: string, message?: string, httpStatus?: number) {
        super(message || code)
        this.code = code
        this.httpStatus = httpStatus
        Object.setPrototypeOf(this, CustomError.prototype)
    }
}
