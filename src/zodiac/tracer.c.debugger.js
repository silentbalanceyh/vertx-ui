import _Session from './store.c.session';
import __Zn from "zone";
import React from 'react';
import {Drawer} from "antd";

// -------------------- 开发工具专用方法（监视器）--------------------------

/**
 * @name zodiac.Debugger
 * @class Debugger
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default (reference) => {
    const keyFn = (event) => {
        // `Home` key
        if (36 === event.keyCode) {
            __Zn.of(reference).in({
                __MONITOR: true
            }).done();
            // reference.?etState({__MONITOR: true});
        }
    }
    const keyAdd = (name) => {
        let data = _Session.get(__Zn.Env.KEY_MDATA);
        if (!data) {
            data = [];
        }
        if (!data.includes(name)) {
            data.push(name);
            _Session.put(__Zn.Env.KEY_MDATA, data);
        }
    }
    const dataItem = (value, name) => {
        const metadata = {};
        metadata.name = name;
        if ("function" === typeof value) {
            metadata.type = "Function";
        } else if ("boolean" === typeof value) {
            metadata.type = "Boolean";
            metadata.value = value;
        } else if ("string" === typeof value) {
            metadata.type = "String";
            metadata.value = value;
        } else {
            if ("children" === name) {
                metadata.type = "ReactChildren"
            } else {
                if (value instanceof React.Component) {
                    metadata.type = "React";
                } else if (__Zn.isTEntity(value)) {
                    metadata.type = value.__type();
                    if (__Zn.isFunction(value.is)) {
                        // Data / Hoc
                        if (value.is()) {
                            metadata.value = value.to();
                        }
                    } else {
                        if (__Zn.isFunction(value.path)) {
                            // DataRouter
                            const valueData = {};
                            valueData.uri = value.path();
                            valueData.params = value.params();
                            metadata.value = valueData;
                        }
                    }
                } else {
                    if (value) {
                        if (__Zn.isFunction(value.to)) {
                            metadata.type = "Zero";
                            metadata.value = value.to();
                        } else {
                            if (__Zn.isArray(value)) {
                                metadata.type = "Array";
                                metadata.value = value;
                            } else if (__Zn.isSet(value)) {
                                metadata.type = "Set";
                                metadata.value = value;
                            } else {
                                metadata.type = "Object";
                                metadata.value = value;
                            }
                        }
                    } else {
                        metadata.type = "Undefined";
                        metadata.value = value;
                    }
                }
            }
        }
        return metadata;
    }
    const dataNorm = (props = {}, state = {}) => {
        const $props = {};
        Object.keys(props)
            .filter(field => "__MONITOR" !== field)
            .filter(field => "form" !== field)
            .filter(field => {
                const component = props[field];
                if (component) {
                    return !component.hasOwnProperty('_reactInternalFiber');
                } else return true;
            })
            .forEach(field => $props[field] = dataItem(props[field], field));
        const $state = {};
        Object.keys(state)
            .filter(field => "__MONITOR" !== field)
            .filter(field => "raft" !== field)
            .forEach(field => $state[field] = dataItem(state[field], field));
        return {
            props: $props,
            state: $state,
        }
    }
    return ({
        on: () => {
            if (__Zn.Env.MONITOR) {
                document.addEventListener(`keydown`, keyFn);
            }
        },
        off: () => {
            if (__Zn.Env.MONITOR) {
                document.removeEventListener(`keydown`, keyFn);
            }
        },
        render: (UIContent) => {
            if (__Zn.Env.MONITOR) {
                const {__MONITOR = false} = reference.state;
                // Monitor 主界面
                return (
                    (<Drawer open={__MONITOR}
                             placement={"bottom"}
                             rootClassName={"web-develop"}
                             title={"Zero Ui Development Debug Monitor"}
                             height={"95%"} destroyOnClose
                             onClose={() => __Zn.of(reference).in({
                                 __MONITOR: false
                             }).done()}>
                        {UIContent ? (<UIContent/>) : false}
                    </Drawer>)
                );
            } else {
                return false;
            }
        },
        initialize: () => {
            if (__Zn.Env.MONITOR) {
                const data = _Session.get(__Zn.Env.KEY_MDATA);
                const dataArray = [];
                if (data) {
                    data.forEach(dataKey => dataArray.push(_Session.get(dataKey)));
                }
                return dataArray;
            } else return [];
        },
        // 数据存储方法
        store: async (name) => {
            if (__Zn.Env.MONITOR) {
                const {props, state} = reference;
                const keyName = __Zn.Env.KEY_MDATA + name;
                // 先添加组件所有的 key 值
                keyAdd(keyName);
                const normalized = dataNorm(props, state);
                normalized.name = name;
                _Session.put(keyName, normalized);
            }
        },
        // 数据清除方法
        clean: async (input) => {
            const data = _Session.get(__Zn.Env.KEY_MDATA);
            if (data) {
                data.forEach(dataKey => _Session.remove(dataKey))
            }
            _Session.remove(__Zn.Env.KEY_MDATA);
            return input;
        }
    });
}