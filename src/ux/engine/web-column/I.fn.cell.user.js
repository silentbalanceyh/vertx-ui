import Abs from '../../abyss';
import Cmn from './I.common';

export default (reference, column) => {
    /*
     * -1. 风格可静态化
     */
    let attrs = Cmn.normalizeInit(column, ["$empty"]);
    /*
     * -2. 配置处理
     */
    const {$config} = column;
    if ($config) {
        attrs.config = Abs.clone($config);
        attrs.$icon = $config.$icon;
    }
    return (text, record = {}) => {
        attrs = Abs.clone(attrs);
        /*
         * 1. 数据绑定专用处理
         */
        if (text) attrs.$key = text;
        attrs.$data = Abs.clone(record);
        return Cmn.jsxUser(attrs);
    }
}