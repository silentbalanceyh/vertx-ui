import React from 'react';
import {Alert} from 'antd';
import './Cab.less';
import U from 'underscore';

class Component extends React.PureComponent {
    render() {
        const {$alert = {}, $type = "info", $icon} = this.props;
        const {message, description} = $alert;

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
        attrs.type = $type;
        attrs.showIcon = true;
        let className = "";
        if ($icon) {
            attrs.icon = $icon;
            className = "web-alert-iconlist";
        } else {
            className = "web-alert-list";
        }
        return (
            <div className={className}>
                <Alert {...attrs}/>
            </div>
        );
    }
}

export default Component;