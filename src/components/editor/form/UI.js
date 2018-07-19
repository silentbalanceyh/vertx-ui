import React from 'react'
import './Cab.less'
import {FormDesigner} from 'web'

class Component extends React.PureComponent {
    render() {
        return (
            <div className={"web-canvas"}>
                <FormDesigner/>
            </div>
        )
    }
}

export default Component