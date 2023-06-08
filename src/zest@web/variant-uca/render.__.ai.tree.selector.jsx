import __Yo from './field.__.fn.yo.configuration';
import React from 'react';
import TreeSelector from './TreeSelector/UI';
// import TreeSelector from './O.selector.tree';
const aiTreeSelector = (reference, jsx = {}) => {
    const {$options = {}} = reference.props;
    if ($options.selectable && jsx.config) {
        /*
         * 这里的 selectable 是字段级的
         * {
         *     "field": {
         *     }
         * }
         */
        jsx.config.selectable = $options.selectable;
    }
    __Yo.yoCssAdjust(jsx, "selector-tree")
    return (<TreeSelector {...jsx} reference={reference}/>);
};
export default {
    aiTreeSelector,
}