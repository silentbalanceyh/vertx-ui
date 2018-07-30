import React from 'react'
import {Card} from 'antd';
import Ux from 'ux';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import Op from './UI.Op';

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
class Component extends React.PureComponent {
    static propTypes = {
        $key: PropTypes.string,
        $card: PropTypes.string
    };

    render() {
        const {
            children, reference, $card = 'page-card',
            $key = "page"
        } = this.props;
        // 左边按钮
        let topbar = Ux.fromHoc(reference, $key);
        // ZeroError：检查点
        if (!topbar) return Ux.fxRender(reference, $key);
        topbar = Immutable.fromJS(topbar).toJS();
        // 解析按钮
        if (topbar.left) topbar.left = Ux.aiExprButton(topbar.left);
        if (topbar.right) topbar.right = Ux.aiExprButton(topbar.right);
        const title = (
            <span>{topbar ? topbar.title : ""}&nbsp;&nbsp;&nbsp;&nbsp;
                {Op.renderButton(reference, topbar)}
                </span>
        );
        // 右边关闭按钮
        let back = (
            <span>
                {topbar.right ? Op.renderButton(reference, topbar, 'right') : false}
                &nbsp;&nbsp;
                {topbar.back ? Op.renderBack(reference, topbar) : false}
            </span>
        );
        return (
            <Card className={$card} bordered={false}
                  title={title}
                  extra={back}>
                {children}
            </Card>
        )
    }
}

export default Component;