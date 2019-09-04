import Ux from "ux";
import Event from "../Op.Event";
import renderJsx from "../Web.Op";

export default (reference, config = {}) => {
    /*
     * 左边按钮处理
     */
    const column = {};
    column.dataIndex = "key";
    column.className = "ux-column-120";
    column.render = (text, record, index) => {
        const {fieldColumn = {}} = config;
        const columns = config.$columnsMy;
        let options = Ux.Ant.toOptions(reference, fieldColumn);
        /*
         * 过滤
         */
        const $columns = Ux.immutable(columns);
        options = options.filter(item => $columns.contains(item.key));
        // ------------- 属性构造 --------------
        /* 添加 */
        const left = {};
        left.icon = 'plus';
        left.disabled = (index === (options.length - 1));
        left.onClick = Event.rxAdd(reference);
        /* 删除 */
        const right = {};
        right.icon = 'minus';
        right.disabled = (0 === index);
        right.onClick = Event.rxRemove(reference, text);
        return renderJsx(reference, {
            left,
            right,
        })
    };
    return column;
};