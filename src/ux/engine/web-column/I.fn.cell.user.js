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
    const {$config = {}} = column;
    return (text) => {
        attrs = Abs.clone(attrs);
        /*
         * 设置 icon Style
         */
        const {$lazy} = reference.state ? reference.state : {};
        const columnValue = $lazy[column.dataIndex];
        let children;
        if (columnValue) {
            children = columnValue[text];
        }
        /*
         * icon 专用
         */
        const {icon} = $config;
        const iconAttrs = {};
        if (icon || !$config.hasOwnProperty("icon")) {
            if (text) {
                iconAttrs.icon = "user";
                iconAttrs.iconStyle = {
                    color: "#CD2990",
                    fontSize: 16
                }
            } else {
                iconAttrs.icon = "setting";
                iconAttrs.iconStyle = {
                    color: "#7D7D7D",
                    fontSize: 16
                }
            }
        }
        delete attrs['$empty'];
        return Cmn.jsxIcon(attrs, children, iconAttrs);
    }
}