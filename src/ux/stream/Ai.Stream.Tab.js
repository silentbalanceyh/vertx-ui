import Prop from '../Ux.Prop'
import Sure from './Ai.Stream.Sure';
import Immutable from 'immutable';
import Meta from './Ai.Stream.Tab.json';
import Ai from '../ai/AI'
import React from 'react'
import {Button} from 'antd';
import U from 'underscore';

const aiExpr = (reference) => {
    // 读取Hoc配置信息
    let tabs = Prop.fromHoc(reference, "tabs");
    tabs = Immutable.fromJS(tabs).toJS();
    if ("string" === typeof tabs) {
        // 最简化的操作
        tabs = Ai.aiExprTabs(tabs.split(','));
    } else {
        if (U.isArray(tabs.items)) {
            tabs.items = Ai.aiExprTabs(tabs.items);
        }
    }
    // tabBarExtraContent解析（和PageCard一致）
    if (tabs.tabBarExtraContent) {
        const content = Ai.aiExprButton(tabs.tabBarExtraContent, reference.props);
        const fnSingle = (item = {}) => {
            const {text, disabledKey, ...rest} = item;
            // 必须包含activeState
            if (reference.state && tabs.activeState) {
                const key = reference.state[tabs.activeState];
                rest.disabled = key !== disabledKey;
            }
            return (<Button {...rest}>{text}</Button>);
        };
        if (0 < content.length) {
            if (1 === content.length) {
                tabs.tabBarExtraContent = fnSingle(content[0]);
            } else {
                tabs.tabBarExtraContent = (
                    <Button.Group>
                        {content.map(fnSingle)}
                    </Button.Group>
                )
            }
        }
    }
    return tabs;
};

class Tab {
    constructor(reference) {
        this.reference = reference;
    }

    init() {
        this.config = aiExpr(this.reference);
        if (!this.config) this.config = {};
        this.config = Immutable.fromJS(this.config).toJS();
        return this;
    }

    disabled(disabled = [], byKey = false) {
        Sure.ensureStream(this);
        const {items = []} = this.config;
        items.forEach((item, index) => {
            // 两种运算
            if (byKey) {
                // byKey的时候，disabled里面是key
                const $disabled = Immutable.fromJS(disabled);
                item.disabled = $disabled.contains(item.key);
            } else {
                item.disabled = !!disabled[index];
            }
        });
        return this;
    }

    mount(target = "", value) {
        const configRef = this.config;
        Sure.itSwitch(target, value, (k, v) => configRef[k] = v, Meta.supported.tabs);
        return this;
    }

    to(...children) {
        Sure.ensureStream(this);
        const {items = [], activeState, ...rest} = this.config;
        const fnOriginal = rest['onChange'];
        if (activeState) {
            rest.onChange = (item) => {
                // 变更Key
                let state = this.reference.state;
                state[activeState] = item;
                state = Immutable.fromJS(state).toJS();
                this.reference.setState(state);
                if (U.isFunction(fnOriginal)) {
                    fnOriginal(item);
                }
            }
        }
        return Ai.aiTabs.apply(null, [items, rest].concat(children))
    }
}

export default Tab;