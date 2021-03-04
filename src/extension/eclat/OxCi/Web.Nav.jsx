import {Breadcrumb} from 'antd';
import React from 'react';
import Op from './event';

export default (reference) => {
    const {$stack = [], $index} = reference.state;
    return (
        <Breadcrumb separator={">"}>
            {$stack.map(item => {
                let className;
                if ($index === item.index) {
                    className = "nav-item nav-active"
                } else {
                    className = "nav-item"
                }
                return (
                    <Breadcrumb.Item key={item.key} className={className}>
                        {/* eslint-disable-next-line */}
                        <a href={"#"} onClick={Op.onSelected(reference, item)}>{item.name}</a>
                    </Breadcrumb.Item>
                )
            })}
        </Breadcrumb>
    )
}