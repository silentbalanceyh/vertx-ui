import React from 'react';
import {Alert, Icon} from 'antd';
import './Cab.less';
import U from 'underscore';

class Component extends React.PureComponent {
    render() {
        const {$alert = {}, $type, $icon, $size = 28} = this.props;
        const {message, description, type = "info"} = $alert;

        let descJsx = false;
        if ("string" === typeof description) {
            descJsx = description;
        } else if (U.isArray(description)) {
            descJsx = (
                <ul>
                    {description.map((item, index) => <li
                        key={item}>{index + 1}.{item}</li>)}
                </ul>
            );
        }
        const attrs = {};
        if (message) {
            // 如果有message，则以message为主
            attrs.message = message;
        }
        attrs.description = descJsx;
        /*
         * 类型处理
         */
        if ($type) {
            attrs.type = $type;
        } else {
            attrs.type = type;
        }
        attrs.showIcon = !$alert.hideIcon;
        let className;
        if (attrs.showIcon) {
            if ($icon) {
                attrs.icon = (<Icon type={$icon} style={{
                    fontSize: $size
                }}/>);
                className = "web-alert-iconlist";
            } else {
                className = "web-alert-list";
            }
        } else {
            className = "web-alert-text";
        }
        return (
            <div className={className}>
                <Alert {...attrs}/>
            </div>
        );
    }
}

export default Component;