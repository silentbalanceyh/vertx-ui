import jsxText from './I.fn.cell.text';
import Abs from '../../abyss';
import Datum from '../datum';
import React from 'react';

export default (reference, column) => {
    const {$renders = {}} = reference.props;
    const Component = $renders[column.dataIndex];
    if (Component) {
        const {config = {}} = column;
        return (text, record) => {
            const data = Abs.clone(record);
            const inherit = Datum.onUniform(reference.props);
            /*
             * value / identifier 特殊，用于生成配置
             */
            if (config.value) {
                data[config.value] = text;
            }
            if (config.mapping) {
                Object.keys(config.mapping).forEach(to => {
                    const from = config.mapping[to];
                    data[to] = data[from];
                })
            }
            inherit.data = data;
            if (Abs.isFunction(Component)) {
                return Component(inherit);
            } else {
                return (<Component {...inherit}/>);
            }
        }
    } else {
        return jsxText(reference, column);
    }
}