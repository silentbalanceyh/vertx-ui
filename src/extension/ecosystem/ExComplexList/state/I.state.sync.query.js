import Ux from "ux";
import {QQuery} from 'entity';

export default (reference, config = {}) => {
    let defaultQuery = {};
    const {$query} = reference.props;
    if (Ux.isEmpty($query)) {
        /*
         * 直接提取 query，query的来源如下：
         * 1）配置中提取 config.query
         * 注：这里的配置来源已经多元化
         * -- config 来源于 Cab.json 中的资源读取（外围读取）
         * -- config 来源于 远程 配置接口
         * 2）直接处理 config.query
         * */
        if (config.query) {
            const query = new QQuery(config.query, reference);
            defaultQuery = query.to();
        }
    } else {
        /*
         * reference.props 中的 $query 优先考虑
         */
        defaultQuery = Ux.clone($query);
    }
    return defaultQuery;
};