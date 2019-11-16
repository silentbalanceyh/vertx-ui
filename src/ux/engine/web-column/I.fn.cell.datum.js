import R from "../expression";
import Cmn from "./I.common";
import Abs from "../../abyss";
import Ele from '../../element';
import Ut from '../../unity';
import U from 'underscore';

export default (reference, columnConfig = {}) => {
    /*
     * -1. 风格可静态化
     */
    let attrs = Cmn.normalizeInit(columnConfig);
    /*
     * -2. 处理 normalized 解析
     * $datum 的相关处理
     */
    const normalized = R.Ant.toUnique(reference, columnConfig);
    const {data = [], config = {}} = normalized;
    const {display, value} = config;

    return (text, record) => {
        attrs = Abs.clone(attrs);
        /*
         * 1. 解析 display, value
         */
        let normalizedText;
        if (U.isArray(text)) {
            /*
             * 多值
             */
            const result = text
                .map(item => Ele.elementUnique(data, value, item))
                .map(item => Ut.valueExpr(display, item, true));
            normalizedText = result.join(',');
        } else {
            /*
             * 单值
             */
            const item = Ele.elementUnique(data, value, text);
            if (item) {
                normalizedText = Ut.valueExpr(display, item, true);
            } else {
                const {$empty} = columnConfig;
                if ($empty) {
                    normalizedText = $empty;
                } else {
                    normalizedText = false;
                }
            }
        }
        return Cmn.jsxSpan(attrs, normalizedText);
    }
}