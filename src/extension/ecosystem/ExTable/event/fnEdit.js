import Ex from "ex";

export default (id, record, metadata = {}) => {
    const {reference} = metadata;
    /* Loading 效果 */
    Ex.rsLoading(reference)();
    /* 读取数据 */
    Ex.rx(reference).view(id).then(data => {
        /* 打开新页 */
        Ex.rx(reference).open(id, data);
        /* 关闭 Loading 用*/
        Ex.rsLoading(reference, false)({});
    });
}