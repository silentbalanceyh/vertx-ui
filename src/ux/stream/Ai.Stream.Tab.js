import Prop from '../Ux.Prop'
import Sure from './Ai.Stream.Sure';
import Immutable from 'immutable';
import Meta from './Ai.Stream.Tab.json';
import Ai from '../ai/AI'

class Tab {
    constructor(reference) {
        this.reference = reference;
    }

    init() {
        // 读取Hoc配置信息
        this.config = Prop.fromHoc(this.reference, "tabs");
        if (!this.config) this.config = {};
        this.config = Immutable.fromJS(this.config).toJS();
        return this;
    }

    disabled(disabled = []) {
        Sure.ensureStream(this);
        const {items = []} = this.config;
        items.forEach((item, index) => item.disabled = !!disabled[index]);
        return this;
    }

    mount(target = "", value) {
        const configRef = this.config;
        Sure.itSwitch(target, value, (k, v) => configRef[k] = v, Meta.supported.tabs);
        return this;
    }

    to(...children) {
        Sure.ensureStream(this);
        const {items = [], ...rest} = this.config;
        return Ai.aiTabs.apply(null, [items, rest].concat(children))
    }
}

export default Tab;