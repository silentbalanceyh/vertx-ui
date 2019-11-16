import React from 'react';
import Ex from 'ex';
import renderJsx from './Web.jsx';
import Op from './Op';
import U from "underscore";

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
            if (!U.isFunction(config.onClick)) {
                console.error("[ ExButton ] 无法绑定 onClick，onClick不是一个合法函数！", config);
                return false;
            } else {
                return renderJsx(this, config);
            }
        }, Ex.parserOfColor("ExButton").action());
    }
}

export default Component;