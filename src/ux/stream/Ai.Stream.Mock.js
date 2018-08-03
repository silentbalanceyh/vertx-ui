import Prop from '../Ux.Prop';
import Log from '../Ux.Log';
import Ai from '../ai/AI';
import Immutable from 'immutable';
import {v4} from 'uuid';

class Mock {
    constructor(reference) {
        this.reference = reference;
    }

    init() {
        const grid = Prop.fromHoc(this.reference, "grid");
        if (grid.options && grid.options.hasOwnProperty("mock.keys")) {
            this.keys = grid.options['mock.keys'].split(",");
        }
        return this;
    }

    bind($list = []) {
        this.source = $list;
        this.data = Immutable.fromJS($list).toJS();
        return this;
    }

    filter($query = {}) {
        this.source.list = Ai.aiCriteria(this.data.list).query($query);
        this.source.count = this.source.list.length;
        this.source.ready = true;
        Log.mocker(this, $query);
        return this;
    }

    get(id = "") {
        if (id) {
            const list = this.data.list ? this.data.list : [];
            const record = list.filter(item => id === item.key);
            if (record[0]) {
                return record[0];
            }
        }
        return {};
    }

    update(record = {}) {
        // 更新原始数据
        if (record.key) {
            const list = this.data.list;
            for (let idx = 0; idx < list.length; idx++) {
                if (record.key === list[idx].key) {
                    list[idx] = record;
                }
            }
        }
        return record;
    }

    add(record = {}) {
        // 更新原始数据
        const keys = this.keys;
        keys.forEach(key => {
            if (!record.hasOwnProperty(key)) {
                record[key] = undefined;
            }
        });
        record.key = v4();
        this.data.list.push(record);
        this.data.count = this.data.length;
        return record;
    }

    remove(id = "") {
        // 更新原始数据
        if (id) {
            const list = this.data.list ? this.data.list : [];
            const filtered = list.filter(item => id !== item.key);
            this.data.list = filtered;
            this.data.count = filtered.length;
        }
        return true;
    }

    to() {
        return this.source;
    }

    raw() {
        const keys = this.keys;
        const source = this.source;
        return {keys, source}
    }
}

export default Mock