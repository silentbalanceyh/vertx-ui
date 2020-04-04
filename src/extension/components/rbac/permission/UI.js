import React from 'react'
import {ExGraphicSpider} from "ei";

import items from './items';

class Component extends React.PureComponent {
    render() {
        return (
            <ExGraphicSpider $items={items} $context={{
                "node-delete": "删除节点",
                "edge-delete": "删除连接"
            }}/>
        )
    }
}

export default Component