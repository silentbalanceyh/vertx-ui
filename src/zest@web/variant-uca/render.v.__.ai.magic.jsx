import __Yo from './field.__.fn.yo.configuration';
import React from 'react';
import {_Ant} from 'zo';
import MagicView from './MagicView/UI';
//import Magic from './O.magic';
const aiMagic = (reference, jsx = {}) => {
    /*
     * 解析 items 专用，必须要有
     */
    const {config = {}, ...rest} = jsx;
    const items = _Ant.toOptions(reference, config);
    if (items && items.length > 0) {
        config.items = items;
    }
    /*
     * 新增 record 解析
     * 格式：prefix = json
     */
    if (config.record) {
        config.rxRecord = _Ant.toRecord(reference, config);
    }
    /*
     * 绑定 $a_ 和 $t_
     */
    const inherit = __Yo.yoPropWith(reference);
    return (<MagicView {...rest} config={config}
                       reference={reference} {...inherit}/>);
};
export default {
    aiMagic,
}