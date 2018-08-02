import Prop from '../Ux.Prop';
import Log from '../Ux.Log';
import Ai from '../ai/AI';
import Immutable from 'immutable';

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

    remove(id = "") {
        // 该方法会变更原始数据
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