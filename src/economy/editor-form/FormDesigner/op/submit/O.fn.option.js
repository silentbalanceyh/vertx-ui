export default (normalized = {}, params = {}) => {
    if (params.dataSource) {
        // 数据源选项配置（静态和动态）
        if ("items" === params.dataSource) {
            // 静态数据源
            const options = [];
            console.info(params.items);
        } else {
            // 动态数据源
        }
    }
}