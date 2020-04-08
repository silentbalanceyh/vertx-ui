import React from 'react';
import {Card} from 'antd';
import Ux from 'ux';
import {Dsl} from 'entity';
import PropTypes from 'prop-types';
import Op from './UI.Op';
import {_zero} from "../../_internal";

/*
 * 基本要求：
 * reference为父引用，和该组件绑定的资源文件必须包含：
 * {
 *      "_topbar":{
 *          "title":"标题文字",
 *          "current":1
 *      }
 * }
 * current需要配合外置的$extra一起使用
 * $key用于解析配置文件
 * $extra用于设置额外的附加工具栏
 */
@_zero({
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
    static propTypes = {
        className: PropTypes.string,
        $key: PropTypes.string,
        $card: PropTypes.string,
        $leftVisible: PropTypes.bool,
        $rightVisible: PropTypes.bool,
        $backVisible: PropTypes.bool
    };

    componentDidMount() {
        Op.initComponent(this);
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
            const title = (
                <span>{titleText}&nbsp;&nbsp;&nbsp;&nbsp;
                    {$leftVisible ? Op.renderButton(this, topbar, "left", $disabled) : false}
                </span>
            );
            // 右边关闭按钮
            let extraContent = $extra ? $extra : (
                <span>
                    {topbar.right && $rightVisible ? Op.renderButton(this, topbar, 'right', $disabled) : false}
                    &nbsp;&nbsp;
                    {topbar.back && $backVisible ? Op.renderBack(this, topbar) : false}
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
            return (
                <Card className={className} bordered={false}
                      {...attrs}>
                    {children}
                </Card>
            );
        } else return false;
    }
}

export default Component;