import React from 'react'
import {KoniEditor} from 'web';
import Ux from 'ux';
import {Tps} from 'app';
import Op from './Op';
import Detail from './UI.Detail';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab'))
    .cab("UI")
    .connect(state => Ux.dataIn(state)
        .rework({
            "graphic": ["nodes"]
        })
        .rinit(["nodes"], true)
        .to()
    )
    .connect({
        fnPointTypes: Tps.fnPointTypes,
    }, true)
    .loading(
        "nodes" // 图左边的节点数据信息
    )
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        const {$app} = this.props;
        // 初始化左边节点类型
        this.props.fnPointTypes({appId: $app._('key')})
    }

    render() {
        const config = Op.initDesigner(this);
        const items = Op.initGraphicItems(this);
        Ux.dgDebug({
            config,
            items
        }, "编辑器配置");
        return (
            <KoniEditor $items={items}
                        $config={config}
                        $components={Detail}/>
        );
    }
}

export default Component;