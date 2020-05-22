import React from 'react'
import {ExGraphicSpider} from "ei";

class Component extends React.PureComponent {
    render() {
        return (
            <ExGraphicSpider $items={[]} $context={{
                "node-delete": "删除节点",
                "edge-delete": "删除连接"
            }}/>
        )
    }
}

export default Component