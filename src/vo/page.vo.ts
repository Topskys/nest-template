/**
 * PageVo类是一个通用分页结果视图对象，用于封装后台查询结果，包括数据内容、总记录数、当前页码和每页显示条目数等信息。
 *
 * @template T 泛型类型，表示PageVo承载的数据数组元素类型
 */
export class PageVo<T> {
    /**
     * 构造函数，用于初始化PageVo实例的各项属性值
     * 
     * @param {T[]} [data] 分页查询结果数据，可选，默认为undefined
     * @param {number} [total] 数据总记录数，可选，默认为undefined
     * @param {number} [page] 当前页码，可选，默认为undefined
     * @param {number} [pageSize] 每页显示的条目数，可选，默认为undefined
     */
    constructor(
        private data?: T[],
        private total?: number,
        private page?: number,
        private pageSize?: number
    ) { }

    // 省略getter和setter方法，可根据需要自行添加对属性的访问控制
}