import {Icon} from "antd";
import React from "react";
import U from "underscore";
import Ele from '../../element';
/*
 * 针对图标进行处理，类型包含icon和image两种
 *
 * * 如果type以`img:`开头，则使用`<img/>`标签
 * * 其他情况则使用Ant Design中的`<Icon/>`处理
 *
 * @param {String} type 传入的字符串值
 * @param {Object} addOn 附加配置
 * @return {*}
 */
export default (type, addOn = {}) => {
    if (type) {
        if ("string" === typeof type) {
            /*
             * 不同前缀下的图片处理
             * 1）如果以 `image:` 开头，格式如：`image:/`的方式，则直接读取 image:/ 后边的部分，标记 <img/>
             * 2）否则直接将 type 作为 <Icon/> 中的 type 属性
             */
            if (type.startsWith("image:/")) {
                const attrs = {};
                attrs.src = type.substring(6);
                return (<img alt={"icons"} {...attrs} {...addOn}/>)
            } else if (type.startsWith("svg:")) {
                const d = type.substring(4);
                const svgColor = addOn['data-color'];
                const svgSize = addOn['data-size'] ? (addOn['data-size'] / 10) : 1;
                return (
                    <span className={"icon-svg"}>
                        <i className={"anticon"}>
                            <svg viewBox="0 0 1024 1024"
                                 width={`${svgSize}em`} height={`${svgSize}em`}
                                 fill={svgColor ? svgColor : "#fff"}>
                                <path d={d}/>
                            </svg>
                        </i>
                    </span>
                )
            } else {
                return (<Icon type={type} size={"large"} {...addOn}/>);
            }
        } else if (U.isObject(type)) {
            /*
             * 另外一种渲染（提示图标）
             */
            if (type.hasOwnProperty("style") && !type.hasOwnProperty("iconStyle")) {
                type.iconStyle = type.style;
                if (type.iconStyle.hasOwnProperty("fontSize")) {
                    type.iconStyle.fontSize = Ele.valueInt(type.iconStyle.fontSize);
                }
            }
            // 文字信息
            let text = type.text || type.label;
            if (!text) text = "";
            return (
                <span>
                    {type['icon'] ? (<Icon type={type['icon']} style={type['iconStyle']}/>) : false}
                    {type['icon'] ? (<span>&nbsp;&nbsp;</span>) : false}
                    <span className={"zero-icon-text"}>{text}</span>
                </span>
            )
        }
    } else return false;     // 没有传入则直接不显示
};