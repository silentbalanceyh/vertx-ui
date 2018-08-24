import Prop from "../prop/Ux.Prop";
import Column from '../Ux.Column';
import Immutable from "immutable";
import Sure from "./Ai.Stream.Sure";
import Ai from "../ai/AI";
import Meta from './Ai.Stream.Table.json';

class Table {
    constructor(reference) {
        this.reference = reference;
    }

    init() {
        // 读取Hoc配置信息
        this.config = Prop.fromHoc(this.reference, "table");
        if (!this.config) this.config = {};
        this.config = Immutable.fromJS(this.config).toJS();
        if (this.config.columns) Column.uiTableColumn(this.reference, this.config.columns);
        return this;
    }

    mount(target = "", value) {
        const configRef = this.config;
        Sure.itSwitch(target, value, (k, v) => configRef[k] = v, Meta.supported.table);
        return this;
    }

    to(dataSource = []) {
        Sure.ensureStream(this);
        const configRef = this.config;
        return Ai.aiTable.apply(null, [dataSource, configRef])
    }
}

export default Table;