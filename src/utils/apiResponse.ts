export default class ApiResponse<T = any> {
    public success: boolean;
    public message: string;
    public data?: T;

    constructor({ success, message, data }: { success: boolean; message: string; data?: T }) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
}