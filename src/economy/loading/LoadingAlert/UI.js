import React from 'react';
import {Alert, Icon} from 'antd';
import './Cab.less';
import U from 'underscore';

class Component extends React.PureComponent {
    render() {
        const {$alert = {}, $type, $icon, $size = 36} = this.props;
        let {className} = this.props;
        const {message, description, type = "info"} = $alert;

        let descJsx = false;
        if ("string" === typeof description) {
            descJsx = description;
        } else if (U.isArray(description)) {
            if (1 === description.length) {
                descJsx = description[0];
            } else {
                descJsx = (
                    <ul>
                        {description.map((item, index) => <li
                            key={item}>{index + 1}.{item}</li>)}
                    </ul>
                );
            }
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
        attrs.showIcon = !$alert['hideIcon'];       // 由于系统中有个地方使用了这种属性，属于遗留代码
        if (!className) {
            className = "";
        } else {
            className += " ";
        }
        if (attrs.showIcon) {
            const icon = $icon ? $icon : $alert.icon;
            if (icon) {
                attrs.icon = (<Icon type={icon} style={{
                    fontSize: $size
                }}/>);
                className += "web-alert-iconlist";
            } else {
                className += "web-alert-list";
            }
        } else {
            className += "web-alert-text";
        }
        return (
            <div className={className}>
                <Alert {...attrs}/>
            </div>
        );
    }
}

export default Component;