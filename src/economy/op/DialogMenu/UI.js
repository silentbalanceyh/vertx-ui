import React from 'react'
import Op from './Op'
import Ux from 'ux'
import U from 'underscore'
import {Button, Dropdown, Icon, Menu} from 'antd'

class Component extends React.PureComponent {
    render() {
        return Ux.fxRender(this, () => {
            const {button = {}, items = [], renders = {}, visible = {}} = this.state;
            button.icon = "down";
            const {text, icon, onClick, ...rest} = button;
            // console.info(renders, items);
            console.info(visible);
            return (
                <Dropdown overlay={
                    <Menu onClick={onClick}>
                        {items.map(item => (
                            <Menu.Item key={item.key}>
                                {U.isFunction(renders[item.key]) ? (
                                    renders[item.key]()
                                ) : false}
                            </Menu.Item>
                        ))}
                    </Menu>
                }>
                    <Button {...rest}>
                        {text ? text : ""}&nbsp;<Icon type={icon}/>
                    </Button>
                </Dropdown>
            )
        })
    };

    componentDidMount() {
        const state = Op.initState(this);
        this.setState(state);
    }
}

export default Component