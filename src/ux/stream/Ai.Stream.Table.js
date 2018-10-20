import Prop from "../prop/Ux.Prop";
import Column from '../Ux.Column';
import Sure from "./Ai.Stream.Sure";
import Ai from "../ai/AI";
import Meta from './Ai.Stream.Table.json';
import U from 'underscore';
import Value from '../Ux.Value';

class Table {
    constructor(reference) {
        this.reference = reference;
    }

    init() {
        // 读取Hoc配置信息
        this.config = Prop.fromHoc(this.reference, "table");
        if (!this.config) this.config = {};
        this.config = Value.clone(this.config);
        if (this.config.columns) {
            this.config.columns = Column.uiTableColumn(this.reference, this.config.columns);
        }
        return this;
    }

    tail(item) {
        if (item) {
            this.config.columns.push(item);
        }
        return this;
    }

    head(item) {
        if (item) {
            this.config.columns = [item].concat(this.config.columns);
        }
        return this;
    }

    columns(fnColumn) {
        if (U.isFunction(fnColumn)) {
            fnColumn(this.config.columns);
        }
        return this;
    }

    pagination(pager = true) {
        this.config.pagination = pager;
        return this;
    }

    bordered(bordered = false) {
        this.config.bordered = bordered;
        return this;
    }

    mount(target = "", value) {
        const configRef = this.config;
        Sure.itSwitch(target, value, (k, v) => configRef[k] = v, Meta.supported.table);
        return this;
    }

    rowSelection(object = {}) {
        let rowSelection = object;
        if (U.isFunction(object)) {
            rowSelection = object(this.reference);
        }
        if (rowSelection) this.config.rowSelection = rowSelection;
        return this;
    }

    to(dataSource = []) {
        Sure.ensureStream(this);
        const configRef = this.config;
        return Ai.aiTable.apply(null, [dataSource, configRef]);
    }
}

export default Table;