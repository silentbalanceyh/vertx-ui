import React from 'react';
import {Menu} from 'antd';
import Event from '../event';

export default (reference) => {
    const {$menus = [], $condMenu} = reference.state;
    return (
        <Menu onSelect={Event.onSelected(reference)}
              className={"job-menu"}
              selectedKeys={$condMenu}>
            {$menus.map(menu => {
                const fnCounter = menu.__counter;
                return (
                    <Menu.Item key={menu.key}>
                        {menu.text}（{fnCounter(reference)}）
                    </Menu.Item>
                )
            })}
        </Menu>
    )
}