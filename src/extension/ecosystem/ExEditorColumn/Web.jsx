import {Checkbox, Transfer} from "antd";
import Ux from "ux";
import React from "react";

const renderComplex = (reference, config = {}) => {
    const {
        $options = [], $selectedKeys = [],
    } = reference.state;
    return (
        <div key={"complex"} className={"ux_op_transfer"}>
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
    const boxes = Ux.elementGrid($options, $combine.grid ? $combine.grid : 3);
    return (
        <div key={"simple"}>
            <Checkbox.Group {...group}>
                {boxes.map((row, rowIdx) => (
                    <div key={`row${rowIdx}`} className={"group_row"}>
                        {row.map(item => (
                            <Checkbox style={style} key={item.key} value={item.key} name={"gColumn"}>
                                {item.label}
                            </Checkbox>
                        ))}
                    </div>
                ))}
            </Checkbox.Group>
            {all ? (
                <div className={"all"}>
                    <Checkbox onChange={() => {
                        if ($selectedKeys.length < $options.length) {
                            const $values = $options.map(item => item.value);
                            Ux.of(reference).in({$selectedKeys: $values}).done();
                            // reference.?etState({$selectedKeys});
                            // reference.?etState({$selectedKeys: $values})
                        } else {
                            Ux.of(reference).in({$selectedKeys: []}).done();
                            // reference.?etState({$selectedKeys});
                            // reference.?etState({$selectedKeys: []});
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