import React from 'react'
import {Button} from 'antd'
import Ux from 'ux';

class Component extends React.PureComponent {

    render() {
        return (
            Ux.aiGrid([21, 3],
                <Button.Group className={"zui-tool"}>
                    <Button icon={"github"}/>
                    <Button icon={"employee.js"}/>
                    <Button icon={"cluster"}/>
                    <Button icon={"mail"}/>
                    <Button icon={"search"}/>
                </Button.Group>
            )
        )
    }
}

export default Component