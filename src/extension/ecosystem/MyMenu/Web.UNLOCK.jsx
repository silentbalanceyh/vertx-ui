import Ux from "ux";
import {Button, Checkbox, List, Tree} from "antd";
import React from "react";
import Op from "./Op";

const renderSource = (reference, fn) => {
    const {$targetKeys = []} = reference.state;
    let {$sourceSelectedKeys = [], $treeData = []} = reference.state;
    $treeData = Ux.clone($treeData);
    Ux.itTree($treeData, item => {
        if ($targetKeys.includes(item.key)) {
            item.disabled = true;
        }
    });
    return (
        <div className={"source"}>
            <Tree treeData={$treeData}
                  checkable
                  defaultExpandAll
                  onCheck={Op.transfer(reference, fn).rxTree}
                  checkedKeys={$sourceSelectedKeys}/>
        </div>
    )
}
const renderTarget = (reference) => {
    const {$targetSelectedKeys = [], $data = [], $treeMap = {}} = reference.state;
    return (
        <div className={"target"}>
            <List dataSource={$data} renderItem={(item, index) => {
                const keys = Op.toKey(item, $treeMap);
                const checked = 0 < keys.filter(key => $targetSelectedKeys.includes(key)).length;
                return (
                    <span className={"target-item"}>
                        <span className={"left"}>
                            <Checkbox onChange={Op.transfer(reference, {
                                ...item,
                                keys,
                            }).rxList} checked={checked}/>&nbsp;&nbsp;
                            {Ux.v4Icon(item.icon, {
                                style: {
                                    ...item.style,
                                    fontSize: 20
                                }
                            })}&nbsp;&nbsp;
                            {item.text}
                        </span>
                        <span className={"right"}>
                            <Button icon={Ux.v4Icon("up")} size={"small"} type={"primary"}
                                    disabled={0 === index}
                                    onClick={event => {
                                        event.stopPropagation();
                                        const queue = $data.map(item => item.key);
                                        const $out = Ux.elementUp(queue, item.key);
                                        const ordered = Ux.elementOrder($data, $out);
                                        Ux.of(reference).in({$data: ordered}).done();
                                        // reference.?etState({$data: ordered});
                                    }}/>
                            &nbsp;
                            <Button icon={Ux.v4Icon("down")} size={"small"}
                                    disabled={($data.length - 1) === index}
                                    onClick={event => {
                                        event.stopPropagation();
                                        const queue = $data.map(item => item.key);
                                        const $out = Ux.elementDown(queue, item.key);
                                        const ordered = Ux.elementOrder($data, $out);
                                        Ux.of(reference).in({$data: ordered}).done();
                                        // reference.?etState({$data: ordered});

                                    }}/>
                        </span>
                    </span>
                );
            }}/>
        </div>
    );
}
export default {
    renderTarget,
    renderSource,
}