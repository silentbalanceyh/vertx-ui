import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from 'ei';
import Op from './Op';
import {TreeSelect} from "antd";

@Ux.zero(Ux.rxEtat(require('../Cab'))
    .cab("UI.Res.Add")
    .to()
)
class Component extends React.PureComponent {
    render() {
        /*
         * 配置处理
         */
        const form = Ex.yoForm(this, null);
        return (
            <ExForm {...form} $height={"300px"}
                    $op={Op.actions}
                    $renders={{
                        identifier: (reference, jsx) => {
                            const models = Ux.onDatum(reference, "resource.models");
                            /* 读取 */
                            const type = Ux.formHit(reference, "type");
                            if (type) {
                                const tree = Ux.toTree(models, {title: "name"});
                                /* 集成的树结构不同 */
                                if ("resource.integration" === type) {
                                    /*
                                     * 集成单独运算
                                     */
                                    const treeData = tree.filter(item => type !== item.data.code);
                                    treeData.forEach(resource => {
                                        resource.selectable = false
                                    });
                                    jsx.treeData = treeData;
                                } else {
                                    const treeData = tree.filter(item => type === item.data.code)
                                    if (treeData[0]) {
                                        /*
                                         * 必须有
                                         */
                                        jsx.treeData = treeData[0].children;
                                    }
                                }
                            } else {
                                /* 没选择时禁用 */
                                jsx.disabled = true;
                            }
                            return (
                                <TreeSelect {...jsx}/>
                            )
                        }
                    }}/>
        );
    }
}

export default Component;