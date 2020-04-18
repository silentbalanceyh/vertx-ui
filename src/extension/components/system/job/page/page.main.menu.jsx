import React from 'react';
import {Menu} from 'antd';
import Event from '../event';

export default (reference) => {
    const {$menus = [], $menusKey = []} = reference.state;
    return (
        <Menu onSelect={Event.rxFilter(reference)}
              selectedKeys={$menusKey}>
            {$menus.map(menu => {
                return (
                    <Menu.Item key={menu.key}>
                        {menu.text}（{menu.counter}）
                    </Menu.Item>
                )
            })}
        </Menu>
    )
}