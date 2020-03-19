import React from 'react'
import {ExDrawerRelation} from "ei";

import items from './items';

class Component extends React.PureComponent {
    render() {
        return (
            <ExDrawerRelation $items={items}/>
        )
    }
}

export default Component