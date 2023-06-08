import __Zn from './zero.uca.dependency';
import React from 'react';
import __TEXT from './render.__.fn._.text';

export default {
    RENDERS: (reference, column) => {
        const {$renders = {}} = reference.props;
        const Component = $renders[column.dataIndex];
        if (Component) {
            let {config = {}, $config = {}} = column;
            /*
             * $config: 标准
             * config：非标准（旧版本）
             */
            config = __Zn.clone(config);
            Object.assign(config, $config);
            return (text, record) => {
                const data = __Zn.clone(record);
                const inherit = __Zn.onUniform(reference.props);
                if (config.value) {                                     // value / identifier 特殊，用于生成配置
                    data[config.value] = text;
                }
                if (config.mapping) {
                    Object.keys(config.mapping).forEach(to => {
                        const from = config.mapping[to];
                        data[to] = data[from];
                    })
                }
                inherit.data = data;
                inherit.config = config;
                inherit.value = text;
                if (__Zn.isFunction(Component)) {
                    return Component(inherit);
                } else {
                    return (<Component {...inherit}/>);
                }
            }
        } else {
            console.warn("没有找到对应的 $renders, column =", column.dataIndex)
            return __TEXT.TEXT(reference, column);
        }
    }
}