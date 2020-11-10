import R from '../../engine/expression';
import T from '../../engine/datum';
import {MagicView} from "web";
import React from "react";

const aiMagic = (reference, jsx = {}) => {
    /*
     * 解析 items 专用，必须要有
     */
    const {config = {}, ...rest} = jsx;
    const items = R.Ant.toOptions(reference, config);
    if (items && items.length > 0) {
        config.items = items;
    }
    /*
     * 新增 record 解析
     * 格式：prefix = json
     */
    if (config.record) {
        config.rxRecord = R.Ant.toRecord(reference, config);
    }
    /*
     * 绑定 $a_ 和 $t_
     */
    const inherit = T.onUniform(reference.props);
    return (<MagicView {...rest} config={config}
                       reference={reference} {...inherit}/>);
};

export default {
    aiMagic,
}