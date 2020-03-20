import React from 'react'
import {ExDrawerRelation} from "ei";

import items from './items';

class Component extends React.PureComponent {
    render() {
        return (
            <ExDrawerRelation $items={items} $context={{
                "node-delete": "删除节点",
                "edge-delete": "删除连接"
            }}/>
        )
    }
}

export default Component