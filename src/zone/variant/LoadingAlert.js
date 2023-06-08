import React from 'react';
import {Alert, Result} from 'antd';
// 内部
import __Is from "../fn.under.is.decision";
import __V4 from '../fn.antd4.v4.icon';
import "./LoadingAlert.norm.scss";
import Sk from 'skin';

class Component extends React.PureComponent {
    render() {
        const {$alert = {}, $type, $icon, $size = 36} = this.props;
        const {message, description, type = "info"} = $alert;

        let descJsx = false;
        if ("string" === typeof description) {
            descJsx = description;
        } else if (__Is.isArray(description)) {
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
        if (attrs.showIcon) {
            const icon = $icon ? $icon : $alert.icon;
            if (icon) {
                attrs.icon = __V4.v4Icon(icon, {
                    style: {
                        fontSize: $size,
                    }
                });
            }
        }
        if ("error" === $type) {
            const {message, ...$rest} = attrs;
            return (
                <div {...Sk.mixUca("LoadingAlert")}>
                    <Result status={"error"}
                            title={message}
                            subTitle={$rest.description}/>
                </div>
            )
        } else {
            return (
                <div {...Sk.mixUca("LoadingAlert")}>
                    <Alert {...attrs} />
                </div>
            )
        }
    }
}

export default Component;