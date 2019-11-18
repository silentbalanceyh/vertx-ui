import React from 'react';
import Ex from 'ex';
import Op from './Op';
import renderJsx from './Web.jsx'

/*
 * React中的props属性
 * {
 *      $app: DataObject - X_APP 应用程序数据,
 *      $router: DataRouter - （react-router）构造对象,
 *      $user: DataArray - 登录的用户基本数据,
 *      fnOut: 专用 redux 写树函数,
 *      config = {
 *          窗口专用配置
 *      },
 *      children = 子组件（直接外层放到子组件中的内容）
 *      $visible = false：当前窗口的显示和隐藏
 *      $submitting = false：当前窗口是否处于提交过程
 * }
 * React属性state：
 * {
 *      $visible: "窗口是否隐藏"
 * }
 */

class Component extends React.PureComponent {
    state = {
        $visible: false,
        $ready: false,
    };

    componentDidMount() {
        Op.yiDialog(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const attributes = Ex.yoAmbient(this);
            /*
             * 按钮形态：按钮或链接
             * 禁用 / 启用 连接
             */
            const {$category = "BUTTON"} = this.props;
            attributes.$category = $category;
            /*
             * 按钮
             */
            const button = Op.yoButton(this);
            /*
             * 窗口
             */
            const dialog = Op.yoDialog(this);
            return renderJsx(this, {
                button,
                dialog,
                attributes
            });
        }, Ex.parserOfColor("ExDialog").private());
    }
}

export default Component;