import React from 'react'
import {Card} from 'antd';
import Ux from 'ux';
import Immutable from 'immutable';
import {DataLabor} from 'entity';
import PropTypes from 'prop-types';
import Op from './UI.Op';
import {_zero} from "../../_internal";

/**
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
        s2p: state => DataLabor.createOut(state)
            .rework({
                "status": ["submitting"]
            })
            .rinit(["submitting"])
            .to()
    }
})
class Component extends React.PureComponent {
    static propTypes = {
        $key: PropTypes.string,
        $card: PropTypes.string
    };

    render() {
        const {
            children, reference, $card = 'page-card',
            $key = "page", $extra
        } = this.props;
        // 左边按钮
        let topbar = Ux.fromHoc(reference, $key);
        // ZeroError：检查点
        if (!topbar) return Ux.fxRender(reference, $key);
        topbar = Immutable.fromJS(topbar).toJS();
        // 解析按钮
        if (topbar.left) topbar.left = Ux.aiExprButton(topbar.left, this.props);
        if (topbar.right) topbar.right = Ux.aiExprButton(topbar.right, this.props);
        const title = (
            <span>{topbar ? topbar.title : ""}&nbsp;&nbsp;&nbsp;&nbsp;
                {Op.renderButton(reference, topbar)}
                </span>
        );
        // 右边关闭按钮
        let extraContent = $extra ? $extra : (
            <span>
                {topbar.right ? Op.renderButton(reference, topbar, 'right') : false}
                &nbsp;&nbsp;
                {topbar.back ? Op.renderBack(reference, topbar) : false}
            </span>
        );
        return (
            <Card className={$card} bordered={false}
                  title={title}
                  extra={extraContent}>
                {children}
            </Card>
        )
    }
}

export default Component;