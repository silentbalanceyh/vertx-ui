import React from 'react'
import {Button, Card} from 'antd';
import Ux from 'ux';
import Immutable from 'immutable';
import PropTypes from 'prop-types';

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
        if (topbar.left) {
            topbar.left = Ux.aiExprButton(topbar.left);
            topbar.title = (<span>
                {topbar ? topbar.title : ""}
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Button.Group>
                    {topbar.left.map(button => {
                        const {text, ...rest} = button;
                        return <Button {...rest}>{text}</Button>
                    })}
                </Button.Group>
            </span>)
        } else {
            topbar.title = topbar ? topbar.title : "";
        }
        // 右边关闭按钮
        let back = false;
        if (topbar.back) {
            back = (<Button icon={"cross"} shape="circle" type={"ghost"} onClick={() => {
                // 写状态树
                if (topbar.back.state) {
                    Ux.writeTree(reference, topbar.back.state);
                }
                // 导航处理
                Ux.toRoute(reference, Ux.Env.ENTRY_ADMIN);
            }}/>)
        }
        return (
            <Card className={$card} bordered={false}
                  title={topbar ? topbar.title : ""}
                  extra={back}>
                {children}
            </Card>
        )
    }
}

export default Component;