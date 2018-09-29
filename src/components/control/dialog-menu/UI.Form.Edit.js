import React from 'react'
import {Button} from "antd";

class Component extends React.PureComponent {
    render() {
        return (
            <Button onClick={(event) => {
                this.props.fnClose()
            }}>Edit fnClose</Button>
        )
    }
}

export default Component