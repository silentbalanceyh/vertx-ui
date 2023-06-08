import dataJsx from './out.@fn._.data.jsx.js';
import __Zn from '../zero.uca.dependency';

export default {
    /*
     * 基础数据部分
     */
    dataField: (normalized = {}, params = {}) => {
        // 是否设置了宽度
        if (params.width) {
            normalized.optionItem.style = {width: params.width};
        }
        // 字段信息设置
        if ("aiTitle" === params.render) {
            normalized.title = params.label ? params.label : "";
        } else if ("aiAction" === params.render) {
            normalized.field = "$button";
        } else {
            normalized.optionItem.label = params.label;
            /*
             * 是否带条件
             */
            if (params.__condition) {
                normalized.field = `${params.field},${params.__condition}`;
            } else {
                normalized.field = params.field;
            }
        }
        // 水印文字处理
        dataJsx(normalized, params, 'placeholder');
    },
    dataBasic: (normalized = {}, params = {}) => {
        // 是否只读
        dataJsx(normalized, params, 'readOnly');
        // 只读文字
        dataJsx(normalized, params, 'inscribe');
        // 是否允许清空
        dataJsx(normalized, params, 'allowClear');
        // 最大长度
        dataJsx(normalized, params, 'maxLength');
        // 特殊属性 config.expr
        if (params.expr) {
            normalized.optionJsx.config.expr = params.expr;
        }
    },
    dataAdorn: (normalized = {}, params = {}) => {
        // 文字前后缀
        dataJsx(normalized, params, 'suffix');
        dataJsx(normalized, params, "prefix");
        // addon 前后缀
        dataJsx(normalized, params, "addonAfter");
        dataJsx(normalized, params, "addonBefore");
    },
    dataFinished: (normalized = {}) => {
        const {optionItem, optionJsx} = normalized;
        // 去掉标签
        if (optionItem.hasOwnProperty("label") &&
            undefined === optionItem.label) {
            delete normalized.optionItem.label;
        }
        // 去掉空配置
        if (optionJsx.config && __Zn.isEmpty(optionJsx.config)) {
            delete normalized.optionJsx.config;
        }
        // 去掉特殊节点 impact
        if (optionJsx.depend && optionJsx.depend.impact) {
            if (__Zn.isEmpty(optionJsx.depend.impact)) {
                delete normalized.optionJsx.depend.impact;
                if (__Zn.isEmpty(optionJsx.depend)) {
                    delete normalized.optionJsx.depend;
                }
            }
        }
    }
}