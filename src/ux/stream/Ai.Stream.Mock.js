import Prop from '../prop/Ux.Prop';
import Log from '../monitor/Mt.Logger';
import Ai from '../ai/AI';
import {v4} from 'uuid';
import Value from '../Ux.Value';
import U from 'underscore';

class Mock {
    constructor(reference) {
        this.reference = reference;
    }

    init() {
        const grid = Prop.fromHoc(this.reference, "grid");
        // 启用了 Mock
        const {options = {}} = grid ? grid : {};
        if (options['mock.enabled']) {
            const keys = options['mock.keys'];
            if (U.isArray(keys)) {
                this.keys = keys;
            } else {
                this.keys = keys.split(",");
            }
        }
        return this;
    }

    /*
     * 1. source 为输入的源头，也就是输入的数据信息
     * 2. data 为处理的数据信息
     */
    bind(source) {
        this.source = source ? Value.clone(source) : undefined;
        this.data = {};
        if (source) {
            if (U.isArray(source)) {
                this.isArray = true;
                this.data = {
                    list: Value.clone(source),
                    count: 0,
                }
            } else if (U.isObject(source)) {
                this.isArray = false;
                this.data = Value.clone(source);
            }
        } else {
            throw new Error("[Ox] 对不起，Mock数据要求有合法输入。");
        }
        return this;
    }

    filter($query = {}) {
        if (this.isArray) {
            const list = Value.clone(this.source);
            this.data.list = Ai.aiSearcher(list).query($query);
            this.data.count = this.data.list.length;
        }
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
        const isArray = this.isArray;
        if (isArray) {
            return this.data.list;
        } else {
            return this.data;
        }
    }

    raw() {
        const keys = this.keys;
        const source = this.source;
        return {keys, source};
    }
}

export default Mock;