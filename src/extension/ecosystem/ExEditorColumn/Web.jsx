import {Checkbox, Transfer} from "antd";
import Ux from "ux";
import React from "react";

const renderComplex = (reference, config = {}) => {
    const {
        $options = [], $selected = [],
    } = reference.state;
    return (
        <div key={"complex"} className={"transfer"}>
            <Transfer {...config}
                      targetKeys={$selected}
                      dataSource={$options}/>
        </div>
    )
}

const renderSimple = (reference, config = {}) => {
    const {
        $options = [], $selected = [], $combine = {}, $group = {},
    } = reference.state;

    /*
     * 选项处理
     */
    const group = Ux.clone($group);
    group.value = $selected;
    const style = Ux.toGrid($combine);
    const {all} = config;
    return (
        <div key={"simple"}>
            <Checkbox.Group {...group}>
                {$options.map(item => (
                    <div style={style} key={item.key} className={"item"}>
                        <Checkbox key={item.key} value={item.key}>
                            {item.label}
                        </Checkbox>
                    </div>
                ))}
            </Checkbox.Group>
            {all ? (
                <div className={"all"}>
                    <Checkbox onChange={() => {
                        if ($selected.length < $options.length) {
                            const $values = $options.map(item => item.value);
                            reference.setState({$selected: $values})
                        } else {
                            reference.setState({$selected: []});
                        }
                    }} checked={$selected.length === $options.length}>{all}</Checkbox>
                </div>
            ) : false}
        </div>
    )
}

export default {
    simple: renderSimple,
    complex: renderComplex
}