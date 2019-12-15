import {TreeSelector} from "web";
import React from "react";

const ai2TreeSelector = (mockData = {}) => (reference, jsx = {}) =>
    (<TreeSelector reference={reference} mock={mockData} {...jsx}/>);

const aiTreeSelector = (reference, jsx = {}) => {
    const {$options = {}} = reference.props;
    if ($options.selectable && jsx.config) {
        jsx.config.$selectable = $options.selectable;
    }
    return (<TreeSelector {...jsx} reference={reference}/>);
};
export default {
    ai2TreeSelector,
    aiTreeSelector
}