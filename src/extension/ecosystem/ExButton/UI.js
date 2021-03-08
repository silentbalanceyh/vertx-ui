import React from 'react';
import Ex from 'ex';
import renderJsx from './Web.jsx';
import Op from './Op';
import Ux from 'ux';

/**
 * ## 「组件」`ExButton`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|x|x|
 *
 * ### 2. 核心
 *
 * 该按钮有两种形态
 *
 * 1. 按钮形态：`<Button/>`。
 * 2. 链接形态：`<Link/>`。
 *
 * @memberOf module:web-component
 * @method ExButton
 */
// =====================================================
// componentInit/componentUp
// =====================================================

class Component extends React.PureComponent {
    state = {
        $ready: true
    };

    render() {
        return Ex.yoRender(this, () => {
            /*
             * 处理核心配置
             *
             **/
            const config = Op.yoButton(this);
            /*
             * onClick 专用检查
             */
            if (!Ux.isFunction(config.onClick)) {
                console.error("[ ExButton ] 无法绑定 onClick，onClick不是一个合法函数！", config);
                return false;
            } else {
                return renderJsx(this, config);
            }
        }, Ex.parserOfColor("ExButton").action());
    }
}

export default Component;