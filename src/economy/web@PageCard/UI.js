import React from 'react';
import {Button, Card} from 'antd';
import Ux from 'ux';
import {Dsl} from 'entity';
import {uca} from "zi";
import Op from './Op';


/**
 * ## 「组件」`PageCard`
 *
 * ```js
 * import { PageCard } from 'web';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok|Ok|x|
 *
 * ### 2. 属性说明
 *
 * |属性名|二级属性|源|类型|说明|
 * |:---|---|:---|:---|:---|
 * |children||props|Jsx|React中专用的`children`子元素信息。|
 * |reference||props|React|父引用，遵循Zero Ui的规范，该变量为固定变量，引用父组件。|
 * |className||props|String|外置传入className，计算最终的风格专用属性，默认`web-card`。|
 * |$key||props|String|读取外层绑定资源文件，调用`Ux.fromXX`作用于reference，默认读取`_page`节点。|
 * |$submitting||props|Boolean|是否处于提交状态，如果提交状态，则会计算按钮的loading属性。|
 * |$title||props|String|卡片标题文本数据，优先使用`$title`属性，|
 * |$leftVisible||props|Boolean|是否隐藏左边按钮。|
 * |$rightVisible||props|Boolean|是否隐藏右边按钮。|
 * |$backVisible||props|Boolean|是否隐藏返回按钮。|
 * |$disabled||props|Object|按钮禁用状态计算，根据不同的状态禁用对应按钮。|
 * |$extra||props|Jsx|是否执行extra属性的注入，计算extraContent部分。|
 * |rxInject||props|Function|「开发」注入配置专用函数。|
 * |$config|left|state|Array|卡片组件左侧按钮。|
 * |$config|right|state|Array|卡片组件右侧按钮。|
 *
 * ### 3. 组件核心点
 *
 * #### 3.1. 工具栏
 *
 * 整个PageCard工具栏分为三部分
 *
 * |左|右|关闭|
 * |---|---|---|
 * |左侧按钮区间|右侧按钮区间|关闭按钮区间|
 * |$leftVisible|$rightVisible|$backVisible|
 *
 * 如果传入了`$extra`变量，那么这个Jsx元素会替换掉`$rightVisible和$backVisible`两个区域的组件。
 *
 * #### 3.2. 防重复提交
 *
 * 左侧和右侧的按钮通常会使用`Ux.connectId`方法触发按钮点击动作，并且会根据`$submitting`的值来判断
 * 当前按钮是否处于加载状态，即使是不在当前组件的子组件中，也可以直接使用该值来渲染按钮的加载。
 *
 * #### 3.3. 禁用状态
 *
 * `$config`变量中存储了`left`和`right`中每一个按钮的`key`信息，而`$disabled`则存储了禁用启用状态（外置传入）。
 *
 * 假设`$disabled`包含了值：
 *
 * ```json
 * {
 *     "key1": true,
 *     "key2": true
 * }
 * ```
 *
 * 上述配置会禁用`key1`和`key2`的按钮信息。
 *
 * @memberOf module:uca/economy
 * @method * PageCard
 */
// =====================================================
// componentInit
// =====================================================
const componentInit = (ref) => {
    const {$key = "page", reference} = ref.props;
    /*
     * 开启双读取模式
     * 1. 直接读取，$key 中不包含 . 操作符
     * 2. 如果 $key 中包含了 . 操作符，则用命中的方式
     */
    let topBar = {};
    if (0 < $key.indexOf('.')) {
        const args = $key.split('.');
        const config = Ux.fromPath.apply(this, [reference].concat(args));
        topBar = Ux.clone(config ? config : {});
    } else {
        const config = Ux.fromHoc(reference, $key);
        topBar = Ux.clone(config ? config : {});
    }

    // 2.拷贝当前hoc配置
    topBar = Ux.clone(topBar ? topBar : {});
    // 3.解析left和right（分别解析）
    if (topBar.left) topBar.left = Ux.aiExprButtons(topBar.left, ref.props);
    if (topBar.right) topBar.right = Ux.aiExprButtons(topBar.right, ref.props);
    // 4.解析结果保存在状态中，只执行一次
    Ux.of(ref).in({$config: topBar}).done();
    // ref.?etState({$config: topBar});
};
// =====================================================
// 渲染周期：Jsx
// =====================================================
const renderButton = (reference, topBar, key = "left", disabled = {}) => {
    const buttons = topBar[key] ? topBar[key] : [];
    return (
        <Button.Group>
            {buttons.map(button => {
                const $item = Ux.clone(button);
                /*
                 * Redux 专用处理
                 */
                const {$submitting} = reference.props;
                if ($submitting && $submitting.is()) {
                    const submitting = $submitting.to();
                    $item.loading = submitting.loading;
                } else {
                    if ("boolean" === typeof $submitting) {
                        $item.loading = $submitting;
                    }
                }
                if (disabled) {
                    if (Ux.isObject(disabled)) {
                        if (disabled.hasOwnProperty($item.key)) {
                            $item.disabled = disabled[$item.key];
                        }
                    } else if (true === disabled) {
                        $item.disabled = disabled;
                    }
                } else {
                    $item.disabled = false;
                }
                const {text, ...rest} = $item;
                return (
                    <Button {...rest}>{text}</Button>
                )
            })}
        </Button.Group>
    )
};
const renderBack = (ref, topBar) => {
    const reference = Ux.onReference(ref, 1);
    return (
        <Button icon={Ux.v4Icon("close")} shape="circle" type={"ghost"}
                className={"extra"}
                onClick={Op.onClickBack(reference, topBar)}/>
    );
};

@uca({
    connect: {
        s2p: state => Dsl.createOut(state)
            .rework({
                "status": ["submitting"]
            })
            .rinit(["submitting"])
            .to()
    }
})
class Component extends React.PureComponent {

    componentDidMount() {
        componentInit(this);
    }

    render() {
        const {
            children, $extra, $title,
            className = Ux.Env.ECONOMY.CARD_CONTAINER,
            $leftVisible = true, $rightVisible = true,
            $backVisible = true,
            // 禁用状态
            $disabled = {},
            // Inject专用函数，用于执行属性变幻
            rxInject = $config => $config
        } = this.props;
        const topbar = rxInject(this.state.$config);
        if (topbar) {
            // 左边按钮
            const titleText = $title ? $title : (topbar ? topbar.title : "");
            const titleIcon = topbar.icon;
            const title = (
                <span className={"title"}>
                    {titleIcon ? (Ux.v4Icon("caret-right")) : false}
                    {titleText}&nbsp;&nbsp;&nbsp;&nbsp;
                    {$leftVisible ? renderButton(this, topbar, "left", $disabled) : false}
                </span>
            );
            // 右边关闭按钮
            let extraContent = $extra ? $extra : (
                <span>
                    {topbar.right && $rightVisible ? renderButton(this, topbar, 'right', $disabled) : false}
                    &nbsp;&nbsp;
                    {topbar.back && $backVisible ? renderBack(this, topbar) : false}
                </span>
            );
            /*
             * 允许没有 title
             */
            const attrs = {};
            if ($title || topbar.title) {
                attrs.title = title;
            }
            if (topbar.right || topbar.back || $extra) {
                attrs.extra = extraContent;
            }
            /*
             * className 优先级处理
             * 1. 优先读取 topbar
             * 2. 其次处理 className
             */
            if (topbar.className) {
                attrs.className = topbar.className;
            } else {
                attrs.className = className;
            }
            return (
                <Card bordered={false} {...attrs}>
                    {children}
                </Card>
            );
        } else return false;
    }
}

export default Component;