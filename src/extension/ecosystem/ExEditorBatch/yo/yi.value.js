import Ux from "ux";
import Rdr from '../Web.Value';

export default (reference, config) => {
    const {valueColumn = {}, fieldColumn = {}} = config;
    const column = {};
    column.dataIndex = "value";
    column.className = "ux-column-300 ux-left-text";
    column.title = valueColumn.title;
    column.render = (text, record) => {
        const columns = config.$columnsMy;
        let options = Ux.RxAnt.toOptions(reference, fieldColumn);
        /*
        * 过滤
        */
        const $columns = Ux.immutable(columns);
        options = options.filter(item => $columns.contains(item.key));
        /*
         * 是否不执行 Render
         */
        let fnRender = () => false;
        if (record.name) {
            // 选中行
            let row = options.filter(option => option.value === record.name);

            if (1 === row.length) {
                row = row[0];
                const {render = {}} = valueColumn;
                let raw = render[row.key];
                // 修正专用
                if (undefined === raw) {
                    fnRender = Rdr['TEXT'](reference);
                } else if ("string" === typeof raw) {
                    fnRender = Rdr[raw](reference);
                } else {
                    const {type, config} = raw;
                    fnRender = Rdr[type](reference, config);
                }
            } else {
                fnRender = Rdr['TEXT'](reference, row);
            }
        }
        return fnRender(record.key, text);
    };
    return column;
}