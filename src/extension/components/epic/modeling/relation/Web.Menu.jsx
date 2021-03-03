import {Menu} from 'antd';
import React from 'react';
import Op from './op';

export default (reference) => {
    const {
        $menus = [],
        $switcher = false,
    } = reference.state;
    let models = $menus;
    if ($switcher) {
        models = $menus.filter(item => 2 === item.level)
    }
    return (
        <Menu className={"ox-rel-menu"} onSelect={Op.onSelected(reference)}>
            {models.map(model => {
                return (
                    <Menu.Item key={model.key} data={model.data}>
                        <img src={model.icon} alt={model.text}/>
                        &nbsp;&nbsp;
                        {model.text}
                    </Menu.Item>
                )
            })}
        </Menu>
    );
}