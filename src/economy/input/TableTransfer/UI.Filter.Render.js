import Ux from "ux";
import {Button} from "antd";
import React from "react";

const on2Filter = (reference, key) => (event) => {
    event.preventDefault();
    let {filters = {}} = reference.state;
    if (key) {
        filters[key] = event.target ? event.target.value : "";
    } else {
        // 清空筛选器
        const $filters = {};
        Object.keys(filters).forEach(key => $filters[key] = undefined);
        filters = $filters;
    }
    filters = Ux.clone(filters);
    reference.setState({filters});
};
const renderButton = (reference) => {
    return (
        <Button.Group>
            <Button icon={"filter"}/>
            <Button icon={"undo"} onClick={on2Filter(reference, null)}/>
        </Button.Group>
    );
};
export default {
    renderButton,
    on2Filter
};