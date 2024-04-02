import { HttpStatus } from "@nestjs/common";

export class Result<T>{

    private code: number;
    private message: string;
    private data: T;

    public constructor(code?: number, message?: string, data?: T) {
        this.code = code;
        this.message = message;
        this.data = data;
    }


    /**
     * 定义一个静态方法`ok`，该方法用于创建一个表示成功状态的结果对象（Result）.
     *
     * @template T 结果对象所携带的数据类型
     * @param {T} [data] 成功时返回的具体业务数据，可选，默认为undefined
     * @param {string} message 自定义的成功提示信息，默认为'请求成功'
     * @returns {Result<T>} 返回封装了状态码、数据及消息的Result对象，状态码默认设置为HttpStatus.OK
     */
    static ok<T>(data?: T, message: string = '请求成功'): Result<T> {
        return new Result<T>().setCode(HttpStatus.OK).setData(data).setMessage(message);
    }


    /**
     * 定义一个静态方法`error`，该方法用于创建一个表示错误状态的结果对象（Result）.
     *
     * @template T 结果对象所携带的数据类型，即使在错误状态下也可能包含部分数据信息
     * @param {string} [message] 自定义的错误提示信息，可选，默认为undefined
     * @param {number} code HTTP状态码，表示错误的具体类型，默认设置为HttpStatus.INTERNAL_SERVER_ERROR（500）
     * @returns {Result<T>} 返回封装了状态码、可能存在的数据及错误消息的Result对象
     */
    static error<T>(message: string = '请求失败', code: number = HttpStatus.BAD_REQUEST): Result<T> {
        return new Result<T>().setCode(code).setMessage(message);
    }

    /**
     * 设置状态码
     * @param code
     */
    setCode(code: number): Result<T> {
        this.code = code;
        return this;
    }

    /**
     * 设置消息
     * @param message
     */
    setMessage(message: string): Result<T> {
        this.message = message;
        return this;
    }

    /**
     * 设置数据
     * @param data
     */
    setData(data: T): Result<T> {
        this.data = data;
        return this;
    }

}