import Ux from "ux";
import Ex from 'ex';
import Event from '../Op.Event';
import renderJsx from '../Web.Field';

export default (reference, config = {}) => {
    const {fieldColumn = {}} = config;
    const column = {};
    column.dataIndex = "name";
    column.className = "ux-column-220";
    column.title = fieldColumn.title;
    column.render = (text, record, index) => {
        const columns = config.$columnsMy; // （读取我可操作的列）
        let options = Ux.RxAnt.toOptions(reference, fieldColumn);
        /*
        * 过滤
        */
        const $columns = Ux.immutable(columns);
        options = options.filter(item => $columns.contains(item.key));
        /*
         * 第二过滤
         * 1. 条件1，$existing中包含的不显示
         * 2. 条件2，当前记录依旧显示
         */
        const {$data = []} = Ex.state(reference);
        const $existing = Ux.immutable($data.map(each => each.name)
            .filter(item => undefined !== item));
        options = options.filter(option => !$existing.contains(option.value) || option.value === text);
        // ------------- 属性构造 --------------
        const select = {};
        select.style = {minWidth: 200};
        select.onChange = Event.rxChange(reference, record.key);
        return renderJsx(reference, {select, options});
    };
    return column;
}