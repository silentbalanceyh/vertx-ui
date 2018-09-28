import React from 'react'
import {DynamicDialog} from "web";
import {Button, Dropdown, Icon, Menu} from 'antd';
import Op from './Op';
import Ux from 'ux';

const renderDropdown = (reference) => {
    const {button = {}, items = []} = reference.state;
    const {text, ...rest} = button;
    return (
        <Dropdown overlay={
            <Menu onClick={rest.onClick(button)}>
                {items.map(item => (
                    <Menu.Item key={item.key}>
                        {item.icon ?
                            <Icon type={item.icon}/> : false} {item.text}
                    </Menu.Item>
                ))}
            </Menu>
        }>
            <Button type={rest.type}>
                {text ? text : ""}<Icon type={"down"}/>
            </Button>
        </Dropdown>
    )
};

class Component extends React.PureComponent {

    componentDidMount() {
        const state = Op.initState(this);
        this.setState(state);
    }

    render() {
        return Ux.fxRender(this, () => {
            const {
                button = {},
                mode = "BUTTON",
                render
            } = this.state;
            // 按钮专用处理
            const {text, onClick, ...rest} = button;
            return (
                <span>
                    {"BUTTON" === mode ? (
                        <Button {...rest} onClick={onClick(button)}>
                            {text ? text : ""}
                        </Button>
                    ) : renderDropdown(this)}
                    {render(this)}
                </span>
            );
        });
    }
}

export default Component