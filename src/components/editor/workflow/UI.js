import React from 'react'
import './Cab.less'
import {FlowDesigner} from 'web';

class Component extends React.Component {
    componentDidMount() {
    }

    render() {
        return (
            <div className={'editor-content'}>
                <FlowDesigner/>
            </div>
        )
    }
}

export default Component