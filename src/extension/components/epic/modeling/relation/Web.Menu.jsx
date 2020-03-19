import {Menu} from 'antd';
import React from 'react';
import Op from './event';

export default (reference) => {
    const {
        $models = [],
        $switcher = false,
    } = reference.state;
    let models = $models;
    if ($switcher) {
        models = $models.filter(item => 2 === item.level)
    }
    return (
        <Menu className={"ox-rel-menu"} onSelect={Op.onSelected(reference)}>
            {models.map(model => {
                return (
                    <Menu.Item key={model.key} data={model.data}>
                        <img src={model.image} alt={model.text}/>
                        &nbsp;&nbsp;
                        {model.text}
                    </Menu.Item>
                )
            })}
        </Menu>
    );
}