import {Button, Col, Empty, Icon, Popconfirm, Row} from "antd";
import React from "react";
import Ele from '../element';
import Cv from '../constant';
import Abs from '../abyss';
import Xt from "../xweb";
import Dev from '../develop';
import T from '../unity';

import './web-unit.less';
import {Link} from "react-router-dom";
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
                return (<Icon type={type} size={"large"} {...addOn}/>);
            }
        } else if (Abs.isObject(type)) {
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

const aiFloatError = (reference, condition = true) => {
    const field = reference.props['data-__field'];
    if (condition) {
        if (field.errors && 0 < field.errors.length) {
            const error = field.errors[0];
            if (error) {
                const message = error.message;
                if (message) {
                    return (
                        <div className={"web-error"}>
                            {message}
                        </div>
                    )
                } else {
                    /*
                     * 未配置 message
                     */
                    console.error("[ Xt ] Error：未配置 message 节点，验证问题！", error);
                    return false;
                }
            } else {
                /*
                 * 错误提取失败
                 */
                return false;
            }
        } else {
            /*
             * 验证无错
             */
            return false;
        }
    } else {
        /*
         * 外置条件不满足
         */
        return false;
    }
};


const _mountEvent = (reference, cell = {}, render, name) => {
    const stateKey = `$${name}`;
    let defined = reference.state ? reference.state[stateKey] : {};
    if (!defined) defined = {};

    /* 生成 fnChange */
    const {field, optionJsx, column = {}} = cell;

    /* 处理 $field 问题 */
    let $field;
    if (undefined !== column.index) {
        $field = [field, column.index];
    } else {
        $field = field;
    }

    /* 事件挂载 */
    let fnEvent;
    if (Abs.isFunction(defined[field])) {
        /* 定义了特殊函数的 */
        fnEvent = event => defined[field](event, optionJsx);
    } else {
        const {id} = reference.props;
        fnEvent = event => {
            const value = Ele.ambEvent(event);
            if (id === field) {
                /* 当前字段直接处理 */
                Abs.fn(reference)[name](value);
            } else {
                /* 读取核心字段 */
                const merged = Xt.xtSet(reference, $field, value);
                reference.setState({data: merged});
                /* 读取更新值 */
                const updated = Xt.xtFormat(merged, column.format);
                Abs.fn(reference)[name](updated);
            }
        }
    }
    const {value = {}} = reference.props; // 由于是自定义控件，这个值一定是必须的
    /* 计算最终值 */
    if (Abs.isArray(value)) {
        if (Abs.isArray($field)) {
            const [targetField, targetIndex] = $field;
            if (targetField && undefined !== targetIndex) {
                const row = value[targetIndex];
                if (row) {
                    optionJsx.value = row[targetField];
                }
            }
        }
    } else {
        if ("string" === typeof $field) {
            optionJsx.value = value[field];       // 值绑定
        }
    }
    return render(reference, optionJsx, fnEvent);
}


function aiChild() {
    /*
     * length = 1，在 jsx 中渲染
     * length = 2, 针对单个 child 执行 fnChild 级别的渲染（带拷贝）
     */
    if (1 === arguments.length) {
        const child = arguments[0];
        const {fnChild, container: Component, ...rest} = child;
        if (Abs.isFunction(fnChild)) {
            /* 因为要调用函数，则直接执行 fnChild 时引入特殊属性触发 */
            const $rest = Abs.clone(rest);
            if (Component) {
                /*
                 * 包含了外层容器的联动渲染
                 */
                return (
                    <Component {...$rest}>
                        {fnChild($rest)}
                    </Component>
                );
            } else {
                return fnChild($rest);
            }
        } else {
            Dev.dgDebug({child}, "[ Ux ] 未检测到 fnChild 函数，返回 false");
            return false;
        }
    } else {
        const children = arguments[0];
        const additional = arguments[1];
        if (Abs.isEmpty(additional)) {
            return children;
        } else {
            /*
             * 暂时只合并配置 config
             */
            if (additional && additional.config
                && children.props.config) {
                /* 合并配置到 additional 中的 config，构造合并后的配置
                *  componentConfig + container构造的新的 config
                *  针对组件：
                *  1）List
                *  2）Form
                * */
                const {$form = {}} = children.props.config;
                additional.$form = Abs.clone($form);
            }
            return React.cloneElement(children, {
                ...additional
            });
        }
    }
}

const aiChildren = (reference, additional = {}) => {
    const {children} = reference.props;
    if (children) {
        if (Abs.isArray(children)) {
            /*
             * 数组对象
             */
            return children
                .filter(item => undefined !== item)
                .map(child => aiChild(child, additional));
        } else {
            /*
             * 单独唯一的对象
             */
            return aiChild(children, additional);
        }
    } else {
        /*
         * React中没有 children 变量（无子组件）
         */
        return false;
    }
};
const aiGridLR = (reference, fnLeft = () => false, fnRight = () => false, config = {}) => {
    const {
        left = 5,
        right = 19,
        leftCls = "",
        rightCls = "",
        rowCls = ""
    } = config;
    const {$opened = false} = reference.state ? reference.state : {};
    const span = $opened ? {left: 0, right: 24} : {left, right};
    return (
        <Row className={rowCls}>
            <Col span={span.left} className={leftCls}>
                {Abs.isFunction(fnLeft) ? fnLeft() : false}
            </Col>
            <Col span={span.right} className={rightCls}>
                {Abs.isFunction(fnRight) ? fnRight() : false}
            </Col>
        </Row>
    )
}

/**
 * ## 「标准」`Ux.aiUrl`
 *
 * 链接计算专用方法，第二参`addOn`中包含了`$router`（DataRouter）对象。
 *
 * ### 1.基本说明
 *
 * 代码逻辑分为两部分：基础路径计算和参数计算。
 *
 * 1. 先根据`uri`计算基础路径。
 * 2. 再追加特定的参数信息到链接后缀中。
 *
 * ### 2.基础路径baseUri
 *
 * |uri|说明|
 * |---|:---|
 * |$MAIN$|该值计算该链接路径为`Z_ENTRY_ADMIN`（环境变量中配置的主界面）|
 * |$SELF$|该值会将链接设置成当前页面（`$router.uri()`）|
 * |其他|1）根据`/`符号的结尾符号执行链接规范化。2）根据`Z_ROUTE`配置追加应用路径。|
 *
 * ### 3.查询参数
 *
 * 1. 先计算路径尾部是否包含`?`操作符。
 * 2. 维持`mid`和`pid`的基础值。
 *
 * |参数名|含义|
 * |---|:---|
 * |mid|Menu主键（主菜单参数值）|
 * |pid|Page主键（页面参数值，二级菜单主键）|
 *
 * > 此处的`mid`和`pid`是为了用户在点击`F5`时维持菜单的开合状态而设置，所以在编程过程中避免使用`mid`和`pid`等参数值。
 *
 * @memberOf module:web-ai
 * @param {Object} item 每一个元素的基本配置。
 * @param {Object} addOn 附加属性，应用于内容层。
 * @returns {String} 跳转链接
 */
const aiUrl = (item = {}, addOn = {}) => {
    const {$router} = addOn;
    let baseUri;
    if ("$MAIN$" === item.uri) {
        baseUri = Cv.ENTRY_ADMIN
    } else if ("$SELF$" === item.uri) {
        baseUri = $router ? $router.uri() : "";
    } else {
        let uri;
        if (item.uri.startsWith("/")) {
            uri = item.uri;
        } else {
            uri = "/" + item.uri;
        }
        if (!uri.startsWith(`/${Cv['ROUTE']}/`)) {
            uri = `/${Cv['ROUTE']}${uri}`
        }
        baseUri = $router ? $router.uri(uri) : uri;
    }
    /*
     * pid / mid
     */
    if (!baseUri.endsWith("?")) {
        baseUri += "?";
    }
    const parameters = [];
    const mid = T.toQuery("mid");
    if (mid) {
        parameters.push(`mid=${mid}`);
    }
    const pid = T.toQuery("pid");
    if (pid) {
        parameters.push(`pid=${pid}`);
    }
    if (0 < parameters.length) {
        baseUri += parameters.join("&");
    }
    return baseUri;
};


/**
 * ## 「标准」`Ux.aiLink`
 *
 * 链接渲染专用流程。
 *
 * ### 1.item的数据结构
 *
 * ```js
 * {
 *     "uri": "链接地址",
 *     "disabled": "是否禁用该链接",
 *     "className": "Css中对应的className",
 *     "text": "文本数据",
 *     "__uri": (event) => {
 *          // onClick函数，Function
 *     }
 * }
 * ```
 *
 * ### 2. 分流程操作
 *
 * #### 2.1. 条件矩阵
 *
 * |编号|uri|disabled|__uri|
 * |---|:---|:---|:---|
 * |A|无值或`EXPAND`|x|x|
 * |B|有值不为`EXPAND`|true|x|
 * |C|有值不为`EXPAND`|false|Function|
 * |D「默认」|有值不为`EXPAND`|false|无|
 *
 *
 * #### 2.2. 条件流程
 *
 * |条件|Jsx元素|流程说明|
 * |:---|:---|:---|
 * |A|`<span/>`|直接显示文本，不显示链接，`<span/>`元素。|
 * |B|`<span/>`|直接显示禁用文本，带`ux-disabled`的className，`<span/>`元素。|
 * |C|`<a/>`|渲染链接，onClick绑定`__uri`，`<a/>`元素。|
 * |D「默认」|`<Link/>`|（react-router）根据item生成`to`属性，`<Link/>`元素，生成调用`aiUrl`函数。|
 *
 * ### 3. 额外说明
 *
 * 系统中使用了`react-router`，而在`addOn`参数中，通常会传入`$router`变量（DataRouter）以方便在链接中触发路由事件。
 * 路由中的onClick事件必须执行如下流程：
 *
 * 1. 调用`event.preventDefault`（或`Ux.prevent`）禁用`<a/>`的默认行为。
 * 2. 然后调用`Ux.toRoute`来执行链接的跳转（这种做法和直接触发`<Link/>`中的`to`类似）。
 *
 * @memberOf module:web-ai
 * @param {Object} item 每一个元素的基本配置。
 * @param {Object} addOn 附加属性，应用于内容层。
 * @returns {JSX.Element}
 */
const aiLink = (item = {}, addOn = {}) => {
    if (item.uri && "EXPAND" !== item.uri) {
        if (item.disabled) {
            return (
                <span className={`ux-disabled ${item.className ? item.className : ""}`}>
                {item.text}
                </span>
            )
        } else {
            if (Abs.isFunction(item.__uri)) {
                return (
                    // eslint-disable-next-line
                    <a href={""} onClick={item.__uri} className={item.className ? item.className : ""}>
                        {item.text}
                    </a>
                )
            } else {
                return (
                    <Link className={item.className ? item.className : ""} to={aiUrl(item, addOn)}>
                        {item.text}
                    </Link>
                )
            }
        }
    } else return (<span>{item.text}</span>);
};

const aiTitle = (item = {}, addOn = {}) => (
    <span className={item.className}>
        {aiIcon(item.icon, addOn)}
        {aiLink(item, addOn)}
    </span>
);
const aiCell = (Element, attrs = {}, text) => {
    if (text && Abs.isObject(text)) {
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
/*
 * 按钮连接的双执行处理，并且携带 confirm 配置
 * 1. 带有 confirm，则执行 Popconfirm 处理，onClick = onConfirm
 * 2. 不带有 confirm，则执行不带 Popconfirm 的，onClick 就是本身函数
 */
const _aiAnchor = (item = {}, onClick, defaultType = "BUTTON") => {
    const {text, category = defaultType, ...rest} = item;
    if (onClick) rest.onClick = onClick
    if ("BUTTON" === category) {

        if (text) {
            // 有文字按钮
            return (
                <Button {...rest}>{text}</Button>
            )
        } else {
            // 无文字按钮
            return (
                <Button {...rest}/>
            )
        }
    } else {
        // 链接执行
        return (
            // eslint-disable-next-line
            <a href={""} key={rest.key} onClick={rest.onClick}>{text}</a>
        )
    }
}
const aiAnchor = (item = {}, onClick, defaultType = "BUTTON") => {
    if (Abs.isFunction(onClick)) {
        const fnClick = event => {
            Abs.prevent(event);
            onClick(event);
        }
        const {confirm, category, ...rest} = item;
        let addOn = {};
        if (confirm) {
            addOn = Abs.clone(rest);
            addOn.category = category ? category : defaultType;
            return (
                <Popconfirm title={confirm} onConfirm={fnClick} key={item.key}>
                    {_aiAnchor(addOn, null)}
                </Popconfirm>
            )
        } else {
            addOn = Abs.clone(item);
            addOn.category = category ? category : defaultType;
            return _aiAnchor(addOn, fnClick);
        }
    } else {
        console.log(`对不起，传入的\`onClick\`不合法，不渲染任何内容。`, item);
        return false;
    }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    aiFloatError,
    aiOn: (render) => ({
        onChange: (reference, jsx) => _mountEvent(reference, jsx, render, "onChange")
    }),
    // Child
    aiChildren,
    aiChild,
    aiGridLR,

    aiIcon,     // 图标解析
    aiUrl,      // 路由表地址解析
    aiLink,     // 链接解析
    aiTitle,    // 标题解析
    aiCell,     // 单元格解析
    aiBlock,    // 上边文字 / 下边图标
    aiEmpty,    // 空处理
    aiAnchor,   // 连接 / 按钮 双执行处理
}