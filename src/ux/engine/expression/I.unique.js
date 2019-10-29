import U from 'underscore';
import Expr from "./O.ai";
import Ut from "../../unity";
import Datum from "../datum";
/*
 * 统一处理
 * 1. config.datum = ... （表单解析动态汇合）
 * 2. config.items = ... （表单解析静态汇合）
 * 3. config.$datum = ...（列解析动态汇合）
 */
const plxUnique = (reference, config = {}) => {
    let source = {};
    if (U.isArray(config.items)) {
        source.data = Expr.aiExprOption(config.items);
        source.config = {
            display: 'label',// 固定值处理
            value: 'key'// 固定值处理
        };
    } else {
        let datum;
        if (config.datum) {
            datum = config.datum;
        } else if (config['$datum']) {
            datum = config['$datum']
        }
        if (datum) {
            const config = "string" === typeof datum ?
                Ut.formatObject(datum, true) : datum;
            /*
             * 计算 list
             */
            if (config) {
                source.data = Datum.onDatum(reference, config.source);
            } else {
                source.data = [];
            }
            /*
             * 兼容处理 label 优先，其次 display
             */
            const $config = {};
            if (config.label) {
                $config.display = config.label;
            } else {
                $config.display = config.display;
            }
            $config.value = config.value;
            source.config = $config;
        }
    }
    /*
     * 解析 value 处理, 数据源的最终生成已经拿到
     * source
     * {
     *     "data": [],    // 数据源
     *     "display": "", // 显示字段
     *     "value": "",   // 显示值
     * }
     */
    return source;
};
export default {
    plxUnique
}