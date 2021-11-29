import React from 'react';
import Ux from 'ux';
import {Button, Transfer} from "antd";
import Ex from "ex";
import Rdr from './Web';
import Op from './Op';

const componentInit = (reference) => {
    const state = {};
    const {tree = [], treeConfig = {}, data = []} = reference.props;
    const {selectable = true, checkable = "ALL", config = {}} = treeConfig;
    const $treeMap = {};
    tree.forEach(item => {
        item.selectable = selectable;
        $treeMap[item.key] = item.uri;
    });
    /*
     * $targetKeys                  -> 确定状态的目标选中项
     * $targetSelectedKeys          -> 选中时变化的目标选中项
     * $sourceKeys                  -> 确定状态的原始选中项（禁用Checkbox）
     * $sourceSelectedKeys          -> 选中时变化的原始选中项
     */
    state.$targetKeys = Op.toKeyTarget(data, $treeMap);
    state.$targetSelectedKeys = [];
    state.$sourceKeys = [];
    state.$sourceSelectedKeys = [];

    const $treeData = Ux.toTree(tree, config);
    Ux.itTree($treeData, item => {
        if (checkable === "CHILDREN") {
            item.checkable = 0 === item.children.length;
        } else {
            item.checkable = true;
        }
    })
    /*
     * $data                        -> 原始列表数据
     * $tree                        -> 原始树型数组
     * $treeData                    -> 树数据
     * $treeMap                     -> （关联处理 uri = key）
     */
    state.$data = data;
    state.$tree = tree;
    state.$treeMap = $treeMap;
    state.$treeData = $treeData;
    state.$ready = true
    reference.setState(state);
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("MyMenu")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {
                $sourceSelectedKeys = [],
                $targetKeys = [],
                $targetSelectedKeys = [],
                $tree = []
            } = this.state;
            const $selectedKeys = $sourceSelectedKeys.concat($targetSelectedKeys);
            return (
                <div>
                    <Transfer selectedKeys={$selectedKeys}
                              targetKeys={$targetKeys}
                              showSelectAll={false}
                              onChange={Op.transfer(this).onChange}
                              dataSource={$tree}>
                        {(args = {}) => {
                            const {direction, onItemSelect, selectedKeys} = args;
                            if ("left" === direction) {
                                // 左侧渲染
                                return Rdr.renderSource(this, {
                                    onItemSelect,
                                    selectedKeys,
                                })
                            } else {
                                // 右边渲染
                                return Rdr.renderTarget(this, {
                                    onItemSelect,
                                    selectedKeys,
                                })
                            }
                        }}
                    </Transfer>
                    <Button id={"$opProcess"} className={"ux-hidden"} onClick={event => {
                        Ux.prevent(event);
                        const {$data = []} = this.state;
                        Ux.fn(this).rxClose($data);
                    }}/>
                </div>
            )
        }, Ex.parserOfColor("MyMenuDialog").control())
    }
}

export default Component