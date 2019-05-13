import Prop from '../prop/Ux.Prop';
import Log from '../monitor/Mt.Logger';
import Ai from '../ai/AI';
import {v4} from 'uuid';
import Value from '../Ux.Value';

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
        this.data = Value.clone($list);
        return this;
    }

    prepare() {
        if (this.source) {
            this.source.ready = false;
        }
        return true;
    }

    filter($query = {}) {
        this.source.list = Ai.aiSearcher(this.data.list).query($query);
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
            let $list = Value.clone(list);
            $list = $list.filter(item => item.key !== record.key);
            $list = $list.reverse();
            $list.push(record);
            $list = $list.reverse();
            this.data.list = $list;
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
        // 保证新添加的数据在最前边
        let $list = Value.clone(this.data.list);
        $list = $list.reverse();
        $list.push(record);
        $list = $list.reverse();
        this.data.list = $list;
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
        return {keys, source};
    }
}

export default Mock;