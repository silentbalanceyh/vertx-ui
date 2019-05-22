import Log from '../monitor/Mt.Logger';
import {v4} from 'uuid';
import Value from '../Ux.Value';
import Tool from './Ai.Stream.Mock.Tool';

class Mock {
    constructor(reference) {
        this.reference = reference;
    }


    init() {
        this.keys = Tool.keys(this.reference);
        return this;
    }

    /*
     * 1. source 为输入的源头，也就是输入的数据信息
     * 2. data 为处理的数据信息
     */
    bind(source) {
        if (source) {
            /* 数据源头 */
            this.source = Value.clone(source);
            this.data = Tool.input(source);
        } else {
            throw new Error("[Ox] 对不起，Mock数据要求有合法输入。");
        }
        return this;
    }

    /*
     * Array / List 可用
     * 1. 动作是一次性的
     * 2. 不修改 this.data
     */
    filter($query = {}) {
        Tool.fnList(this.data, () => this.result = Tool.filter(this.data, $query));
        Log.mocker(this, $query);
        return this;
    }

    get(id = "") {
        return Tool.fnList(this.data, () => Tool.get(this.data, id));
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

    /**
     * 副作用，修改 source
     * @param id
     * @returns {boolean}
     */
    remove(id = "") {
        // 更新原始数据
        Tool.fnList(this.data, () =>
            this.source = Tool.remove(this.data, id));

        return true;
    }

    to() {
        return this.result;
    }

    raw() {
        const keys = this.keys;
        const source = this.source;
        const data = this.data;
        return {keys, source, data};
    }
}

export default Mock;