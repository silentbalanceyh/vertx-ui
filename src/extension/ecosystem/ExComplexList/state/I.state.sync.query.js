import Ux from "ux";

export default (reference, config = {}) => {
    /*
     * 直接提取 query，query的来源如下：
     * 1）配置中提取 config.query
     * 注：这里的配置来源已经多元化
     * -- config 来源于 Cab.json 中的资源读取（外围读取）
     * -- config 来源于 编码 ，替换原来的 props.$query 部分
     * -- config 来源于 远程 配置接口
     * 2）直接处理 config.query
     * */
    let defaultQuery = {};
    if (config.query) {
        const query = Ux.clone(config.query);
        defaultQuery = Ux.irGrid(query, reference);
    }
    return defaultQuery;
};