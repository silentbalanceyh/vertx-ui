import React from 'react';
import {Toolbar} from '@antv/x6-react-components';
import '@antv/x6-react-components/es/toolbar/style/index.css';
import {Icon} from 'antd';

export default (reference, $gEvent) => {
    const toolbar = $gEvent.uiToolbar();
    const {items = [], ...rest} = toolbar;
    rest.hoverEffect = true;
    return (
        <Toolbar {...rest}>
            {items.map((group, index) => (
                <Toolbar.Group key={`group${index}`}>
                    {group.map(item => {
                        const attrs = {};
                        attrs.key = item.name;
                        attrs.name = item.name;
                        if (item.icon) {
                            attrs.icon = (<Icon type={item.icon}/>);
                        }
                        attrs.tooltip = item.tooltip;
                        attrs.disabled = item.disabled;
                        return (
                            <Toolbar.Item {...attrs}/>
                        );
                    })}
                </Toolbar.Group>
            ))}
        </Toolbar>
    )
}