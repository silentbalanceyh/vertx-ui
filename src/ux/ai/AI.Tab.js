import React from 'react'
import {Tabs} from 'antd';

const aiTabs = (items = [], rest = {}, ...children) => {
    return (
        <Tabs {...rest}>
            {items.map((item, index) => (
                <Tabs.TabPane {...item}>
                    {children[index]}
                </Tabs.TabPane>
            ))}
        </Tabs>
    )
};

export default {
    aiTabs
}