import React from 'react';
import {Menu} from 'antd';
import Event from '../event';

export default (reference) => {
    const {
        $menus = [],
    } = reference.state;
    return (
        <Menu className={"ext-form-menu"} onSelect={Event.onSelected(reference)}>
            {$menus.map(model => {
                return (
                    <Menu.Item key={model.key} data={model.data}>
                        <img src={model.icon} alt={model.text}/>
                        &nbsp;&nbsp;
                        {model.text}
                    </Menu.Item>
                )
            })}
        </Menu>
    )
}