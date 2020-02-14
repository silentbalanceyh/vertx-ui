import Cmn from "./I.common";
import Abs from "../../abyss";
import Ut from '../../unity';
import {Tooltip} from 'antd'
import React from 'react';
import './Cab.less';

export default (reference, config) => {
    /*
     * -1. 风格可静态化
     */
    let attrs = Cmn.normalizeInit(config);
    /*
     * -2. 必须删除 $expr
     */
    attrs.reference = reference;
    return (text, record) => {
        attrs = Abs.clone(attrs);
        /*
         * 1.格式化文字
         **/
        let normalizedText = Cmn.normalizeText(text, config, record);
        let isPop = false;
        if (normalizedText) {
            /*
             * 2.链接专用处理
             */
            const $config = config["$config"] ? config["$config"] : {};
            if ($config.url) {
                attrs.url = Ut.formatExpr($config.url, record, true);
            }
            /*
             * 3.Overflow
             */
            isPop = Cmn.normalizeOverflow(attrs, config);
        }
        return isPop ? (
            <Tooltip title={normalizedText}
                     overlayClassName={"web-tool-tip"}>
                {Cmn.jsxHyper(attrs, normalizedText)}
            </Tooltip>
        ) : Cmn.jsxHyper(attrs, normalizedText);
    }
}