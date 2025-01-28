export default class ApiError extends Error {
    public statusCode: number;
    public success: boolean

    constructor({ message, statusCode }: { message: string; statusCode: number }) {
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.success = statusCode < 400
    }
}