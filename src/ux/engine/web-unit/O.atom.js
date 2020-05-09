import {Empty, Icon} from "antd";
import React from "react";
import {Link} from "react-router-dom";
import Cv from '../../constant';
import U from "underscore";
import Ele from '../../element';
import './Cab.less';

/*
 * 针对图标进行处理，类型包含icon和image两种
 * * 如果type以`img:`开头，则使用`<img/>`标签
 * * 其他情况则使用Ant Design中的`<Icon/>`处理
 * @param {String} type 传入的字符串值
 * @param {Object} addOn 附加配置
 * @return {*}
 */
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
/*
 * 基本输入
 * {
 *     uri: 路径信息
 * }
 * 1）uri = "$MAIN$" 时，环境变量中的 ENTRY_ADMIN（管理主页）
 * 2）uri = "$SELF$" 时，通过 $router 抓取的当前页
 * 3）uri = "/xxx" 时，直接为 $router.uri(xxx) 的调用结果
 */
const aiUrl = (item = {}, addOn = {}) => {
    const {$router} = addOn;
    if ("$MAIN$" === item.uri) {
        return Cv.ENTRY_ADMIN;
    } else if ("$SELF$" === item.uri) {
        return $router ? $router.uri() : "";
    } else {
        return $router ? $router.uri(item.uri) : item.uri;
    }
};
/*
 * 基本输入
 * {
 *     uri: 路径信息
 *     text: 基本链接文本信息
 * }
 */
const aiLink = (item = {}, addOn = {}) => {
    if (item.uri) {
        return item.disabled ? (
            <span className={`ux-disabled ${item.className ? item.className : ""}`}>
                {item.text}
            </span>
        ) : (
            <Link className={item.className ? item.className : ""} to={aiUrl(item, addOn)}>
                {item.text}
            </Link>
        );
    } else return (<span>{item.text}</span>);
};

const aiTitle = (item = {}, addOn = {}) => (
    <span className={item.className}>
        {aiIcon(item.icon, addOn)}
        {aiLink(item, addOn)}
    </span>
);
const aiCell = (Element, attrs = {}, text) => {
    if (text && U.isObject(text)) {
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
/*
 * 上边图标下边文字
 */
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
            style.fontSize = Ele.valueInt(kv[2]);
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
        <dl key={attrs.dl} className={"ex-block"}>
            <dt key={attrs.dt}>
                <Icon {...iconAttrs}/>
            </dt>
            <dd key={attrs.dd}>
                {text}
            </dd>
        </dl>
    )
};
const aiEmpty = (size = 30) => (
    <div style={{paddingTop: size, paddingBottom: size}}>
        <Empty/>
    </div>
);
export default {
    aiIcon,     // 图标解析
    aiUrl,      // 路由表地址解析
    aiLink,     // 链接解析
    aiTitle,    // 标题解析
    aiCell,     // 单元格解析
    aiBlock,    // 上边文字 / 下边图标
    aiEmpty,    // 空处理
}