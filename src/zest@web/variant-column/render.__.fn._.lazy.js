import __Zn from './zero.uca.dependency';
import __JSX from './column.__.fn.jsx.segment';
import __NORM from './column.__.fn.norm.text';

const Cv = __Zn.Env;

const Cmn = {
    ...__JSX,
    ...__NORM,
}
const LAZY_COLUMN = (reference, column) => {
    let attrs = Cmn.normInit(column, [Cv.K_NAME.EMPTY]);                              // -1. 风格可静态化
    const {$config = {}} = column;                                                       // -2. 配置处理
    return (text, record) => {
        attrs = __Zn.clone(attrs);
        const {$lazy = {}} = reference.state ? reference.state : {};                     // 设置 icon Style
        const columnValue = $lazy[column.dataIndex];
        let children;
        if (columnValue) {
            children = columnValue[text];
            if (!children) {
                children = columnValue['undefined']
            }
        }
        const {icon} = $config;
        const iconAttrs = {};
        if (icon || !$config.hasOwnProperty("icon")) {
            if (text) {
                const segments = icon ? icon.split(',') : [];
                iconAttrs.icon = segments[0] ? segments[0] : "user";
                iconAttrs.iconStyle = {
                    color: segments[1] ? segments[1] : __Zn.onColor(reference),
                    fontSize: 16
                }
            } else {
                const segments = icon ? icon.split(',') : [];
                iconAttrs.icon = segments[0] ? segments[0] : "setting";
                iconAttrs.iconStyle = {
                    color: segments[1] ? segments[1] : "#7D7D7D",
                    fontSize: 16
                }
            }
        }
        delete attrs[Cv.K_NAME.EMPTY];
        return Cmn.jsxIcon(attrs, children, iconAttrs);
    }
};
export default {
    USER: LAZY_COLUMN,  // 旧版
    LAZY: LAZY_COLUMN,  // 新版
}