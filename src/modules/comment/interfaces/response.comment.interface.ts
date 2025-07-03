export interface IReturnResponse<T = any> {
    data?: T | null,
    message?: string,
    error?:string | T;
}