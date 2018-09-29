import React from 'react'
import Op from './Op'
import Ux from 'ux'
import U from 'underscore'
import {Button, Dropdown, Icon, Menu} from 'antd'

class Component extends React.PureComponent {
    render() {
        const reference = this;
        return Ux.fxRender(this, () => {
            const {
                button = {}, items = [],
                renders = {}, windows = {},
            } = reference.state;
            button.icon = "down";
            const {text, icon, onClick, ...rest} = button;
            return (
                <span>
                    <Dropdown overlay={
                        <Menu onClick={onClick} key={Ux.randomUUID()}>
                            {items.filter(item => U.isFunction(renders[item.key]))
                                .map(item => (
                                    <Menu.Item key={item.key}>
                                        {renders[item.key]()}
                                    </Menu.Item>
                                ))}
                        </Menu>
                    }>
                        <Button {...rest}>
                            {text ? text : ""}&nbsp;<Icon type={icon}/>
                        </Button>
                    </Dropdown>
                    {items.filter(item => windows.hasOwnProperty(item.key))
                        .filter(item => U.isFunction(windows[item.key]))
                        .map(item => windows[item.key]())}
                </span>
            )
        })
    };

    componentDidMount() {
        const state = Op.initState(this);
        this.setState(state);
    }
}

export default Component