import React from 'react'
import {Card} from 'antd';
import './Cab.less';
import Ux from 'ux';
import PropTypes from 'prop-types';
import Immutable from "immutable";
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
        $key: PropTypes.string,
        $card: PropTypes.string
    };

    render() {
        const {
            children, reference, $card = 'page-card',
            $key = "page", $extra, $current
        } = this.props;

        // 左边按钮
        let topbar = Ux.fromHoc(reference, $key);
        // ZeroError：检查点
        if (!topbar) return Ux.fxRender(reference, $key);
        topbar = Immutable.fromJS(topbar).toJS();
        if (topbar.left) {
            topbar.left = Ux.aiExprButton(topbar.left, this.props);
            // 2次提交专用
        }
        // 标题和左边工具栏
        const title = (
            <span>{topbar ? topbar.title : ""}&nbsp;&nbsp;&nbsp;&nbsp;
                {Op.renderButton(reference, topbar)}
                </span>
        );
        // 右边帮助信息
        let extraContent = $extra ? $extra : (topbar.help ? Op.renderHelp(reference, topbar, $current) : false);
        return (
            <Card className={$card} title={title} bordered={false}
                  extra={extraContent}>
                {children}
            </Card>
        )
    }
}

export default Component;