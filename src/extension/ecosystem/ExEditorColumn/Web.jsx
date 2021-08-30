import {Checkbox, Transfer} from "antd";
import Ux from "ux";
import React from "react";

const renderComplex = (reference, config = {}) => {
    const {
        $options = [], $selectedKeys = [],
    } = reference.state;
    return (
        <div key={"complex"} className={"ux-transfer"}>
            <Transfer {...config}
                      targetKeys={$selectedKeys}
                      dataSource={$options}/>
        </div>
    )
}

const renderSimple = (reference, config = {}) => {
    const {
        $options = [], $selectedKeys = [], $combine = {}, $group = {},
    } = reference.state;

    /*
     * 选项处理
     */
    const group = Ux.clone($group);
    group.value = $selectedKeys;
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
                        if ($selectedKeys.length < $options.length) {
                            const $values = $options.map(item => item.value);
                            reference.setState({$selectedKeys: $values})
                        } else {
                            reference.setState({$selectedKeys: []});
                        }
                    }} checked={$selectedKeys.length === $options.length}>{all}</Checkbox>
                </div>
            ) : false}
        </div>
    )
}

export default {
    simple: renderSimple,
    complex: renderComplex
}