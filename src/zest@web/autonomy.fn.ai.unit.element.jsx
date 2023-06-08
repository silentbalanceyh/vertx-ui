import {Button, Empty} from "antd";
import React from 'react';

import __Zn from './zero.module.dependency';
import __LNK from './autonomy.fn.ai.unit.link';


const aiItemTransfer = (item, reference) => {
    const {$selectedKeys = []} = reference.state;
    if ($selectedKeys.includes(item.key)) {
        // 已选择专用
        let isFirst = false;
        let isLast = false;
        $selectedKeys.forEach((each, index) => {
            if (0 === index && each === item.key) {
                isFirst = true;
            }
            if (($selectedKeys.length) - 1 === index && each === item.key) {
                isLast = true;
            }
        })
        return (
            <span>
                <span className={"left"}>
                    {item.label + `（${item.key}）`}
                </span>
                <span className={"right"}>
                    <Button icon={__Zn.v4Icon("up")} size={"small"} type={"primary"}
                            disabled={isFirst}
                            onClick={event => {
                                event.stopPropagation();
                                const $element = __Zn.elementUp($selectedKeys, item.key);
                                __Zn.of(reference).in({
                                    $selectedKeys: $element
                                }).done();
                                // reference.?etState({$selectedKeys: $element});
                            }}/>
                    &nbsp;
                    <Button icon={__Zn.v4Icon("down")} size={"small"}
                            disabled={isLast}
                            onClick={event => {
                                event.stopPropagation();
                                const $element = __Zn.elementDown($selectedKeys, item.key);
                                __Zn.of(reference).in({
                                    $selectedKeys: $element
                                }).done();
                                // reference.?etState({$selectedKeys: $element});
                            }}/>
                </span>
            </span>
        );
    } else {
        return item.label + `（${item.key}）`
    }
}
const aiIcon = (type, addOn = {}) => {
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
                return __Zn.v4Icon({
                    type,
                    size: "large",
                    ...addOn
                });
            }
        } else if (__Zn.isObject(type)) {
            /*
             * 另外一种渲染（提示图标）
             */
            if (type.hasOwnProperty("style") && !type.hasOwnProperty("iconStyle")) {
                type.iconStyle = type.style;
                if (type.iconStyle.hasOwnProperty("fontSize")) {
                    type.iconStyle.fontSize = __Zn.valueInt(type.iconStyle.fontSize);
                }
            }
            // 文字信息
            let text = type.text || type.label;
            if (!text) text = "";
            return (
                <span className={"ux_icon_item"}>
                    {type['icon'] ? (__Zn.v4Icon({
                        type: type['icon'],
                        style: type['iconStyle']
                    })) : false}
                    <label>{text}</label>
                </span>
            );
        }
    } else return false;     // 没有传入则直接不显示
};
const aiYN = (value) => {
    if (value) {
        return __Zn.v4Icon({
            type: "check",
            style: {
                fontSize: 14,
                color: "#32CD32"
            }
        });
    } else {
        return __Zn.v4Icon({
            type: "close",
            style: {

                fontSize: 14,
                color: "#CD3333"
            }
        });
    }
}
const aiBlock = (icon, text, key) => {
    const attrs = {};
    // Fix unique key issue
    if (key) {
        attrs.dl = `dl${key}`;
        attrs.dt = `dt${key}`;
        attrs.dd = `dd${key}`;
    }
    const iconAttrs = {};
    if (0 < icon.indexOf(":")) {
        const kv = icon.split(":");
        iconAttrs.type = kv[0];
        const style = {};
        if (kv[1]) {
            style.color = kv[1];
        }
        if (kv[2]) {
            style.fontSize = __Zn.valueInt(kv[2]);
        }
        if (!style.fontSize) style.fontSize = 24;
        iconAttrs.style = style;
        if (kv[3]) {
            iconAttrs.theme = kv[3];
        }
        /*
         * 修正信息
         */
        if ("twoTone" === iconAttrs.theme) {
            iconAttrs.twoToneColor = style.color;
            delete iconAttrs.style.color;
        }
    } else {
        iconAttrs.type = icon;
        iconAttrs.style = {
            fontSize: 24
        }
    }
    return (
        <dl key={attrs.dl} className={"ux_block"}>
            <dt key={attrs.dt}>
                {__Zn.v4Icon(iconAttrs)}
            </dt>
            <dd key={attrs.dd}>
                {text}
            </dd>
        </dl>
    );
};
const aiEmpty = (size = 30) => (
    <div style={{paddingTop: size, paddingBottom: size}}>
        <Empty/>
    </div>
);
const aiTitle = (item = {}, addOn = {}) => (
    <span className={item.className}>
        {aiIcon(item.icon, addOn)}
        {__LNK.aiLink(item, addOn)}
    </span>
);

const aiCell = (Element, attrs = {}, text) => {
    if (text && __Zn.isObject(text)) {
        // 是否包含了colSpan和className
        const obj = {props: {}};
        if (text.hasOwnProperty('colSpan')) {
            obj.props.colSpan = text.colSpan;
        }
        // 等于0的时候直接就不计算了
        if (0 < obj.props.colSpan) {
            const {className = "", value} = text;
            obj.children = (
                <span className={className}>
                    <Element {...attrs} value={value}/>
                </span>
            );
        }
        return obj;
    } else {
        // 纯渲染
        attrs.value = text;
    }
    return (<Element {...attrs}/>);
};
export default {
    aiYN,               // 图标是否（专用简易处理）
    aiIcon,             // 图标解析
    aiTitle,            // 标题解析
    aiCell,             // 单元格解析
    aiBlock,            // 上边文字 / 下边图标
    aiEmpty,            // 空处理
    aiItemTransfer,     // Transfer
}