import Ux from "ux";
import {Button} from "antd";
import React from "react";

const _getFilters = (reference, key, value) => {
    let {filters = {}} = reference.state;
    if (key) {
        filters[key] = value;
    } else {
        // 清空筛选器
        const $filters = {};
        Object.keys(filters).forEach(key => $filters[key] = undefined);
        filters = $filters;
    }
    return Ux.clone(filters);
};

const _on2Clear = (reference) => (event) => {
    event.preventDefault();
    const filters = _getFilters(reference, null);
    reference.setState({filters});
    // 上层
    const ref = Ux.onReference(reference, 1);
    ref.setState({filters});
};
const _on2Click = (reference) => (event) => {
    event.preventDefault();
    const {filters = {}} = reference.state;
    // 上层
    const ref = Ux.onReference(reference, 1);
    ref.setState({filters});
};

const on2Filter = (reference, key) => (event) => {
    event.preventDefault();
    const filters = _getFilters(reference, key, event.target ? event.target.value : "");
    reference.setState({filters});
};
const renderButton = (reference) => {
    return (
        <Button.Group>
            <Button icon={"filter"} onClick={_on2Click(reference)}/>
            <Button icon={"undo"} onClick={_on2Clear(reference, null)}/>
        </Button.Group>
    );
};
export default {
    renderButton,
    on2Filter
};