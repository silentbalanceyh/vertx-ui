import Ux from 'ux';

const mockArray = (data = [], start, size) => {
    const startIndex = (start - 1) * size;
    const endIndex = startIndex + size;
    console.warn("模拟索引：", start, size, startIndex, endIndex)
    return data.filter((item, index) => (startIndex <= index) && (index < endIndex));
}
const mockSearch = (response = [], request) => {
    const result = {};
    /*
     * 分页参数
     */
    const {pager = {}, criteria = {}} = request;
    /*
     * 过滤条件模拟
     */
    let source = Ux.clone(response);
    if (criteria.keyword) {
        source = source.filter(item => item.name && 0 <= item.name.indexOf(criteria.keyword))
    }
    console.warn("模拟过滤条件和结果：", criteria, source);
    result.count = source.length ? source.length : 0;
    result.list = mockArray(source,
        pager.page ? pager.page : 1,
        pager.size ? pager.size : 10
    );
    return Promise.resolve(result);
}
export default {
    mockSearch
}