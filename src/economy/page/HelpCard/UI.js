import React from 'react';
import {Card} from 'antd';
import './Cab.less';
import Ux from 'ux';
import PropTypes from 'prop-types';
import Op from "./UI.Op";
import {_zero} from "../../_internal";
import {DataLabor} from 'entity';

/**
 * 基本要求：
 * reference为父引用，和该组件绑定的资源文件必须包含：
 * {
 *      "_topbar":{
 *          "title":"标题文字",
 *          "step":{
 *              "active":1,
 *              "items":[
 *              ]
 *          }
 *      }
 * }
 */
@_zero({
    connect: {
        s2p: state => DataLabor.createOut(state)
            .rework({
                "status": ["submitting"]
            })
            .rinit(["submitting"])
            .to()
    },
    verify: (reference) => Ux.verifyCard(reference)
})
class Component extends React.PureComponent {
    static propTypes = {
        className: PropTypes.string,
        $key: PropTypes.string,
        $card: PropTypes.string,
        $leftVisible: PropTypes.bool
    };

    componentDidMount() {
        Op.initComponent(this);
    }

    render() {
        const {
            children, reference,
            className = "page-card", $card = 'page-card',
            $extra: ExtraComponent, $current,
            $leftVisible = true,
            $leftComponent, // 左边替换title的专用组件
            // Inject专用函数，用于执行属性变幻
            rxInject = $config => $config
        } = this.props;

        const topbar = rxInject(this.state.$config);
        if (topbar) {
            // 标题和左边工具栏
            const title = (
                <span>{topbar ? topbar.title : ""}&nbsp;&nbsp;&nbsp;&nbsp;
                    {$leftVisible ? ($leftComponent ? $leftComponent :
                        Op.renderButton(reference, topbar)) : false}
                </span>
            );
            // 右边帮助信息
            let extraContent = ExtraComponent ?
                <ExtraComponent/> : (
                    <span>
                        {topbar.help ? Ux.aiGrid([20, 4],
                            topbar.help ? Op.renderHelp(reference, topbar, $current) : false,
                            topbar.back ? Op.renderBack(reference, topbar) : false
                        ) : topbar.back ? Op.renderBack(reference, topbar) : false}
                    </span>
                );
            const clazz = Ux.flowable($card, className, "");
            return (
                <Card className={clazz} title={title} bordered={false}
                      extra={extraContent}>
                    {children}
                </Card>
            );
        } else return false;
    }
}

export default Component;