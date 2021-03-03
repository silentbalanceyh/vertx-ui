import React from 'react'
import './Cab.less'

import UI from 'oi';
import Ex from 'ex';

import Op from './Op';

const configuration = {
    name: "PxModule",
    color: "#548B54",
    type: "Page"
};

@Ex.ox(configuration)
class Component extends React.PureComponent {

    render() {
        const {$container = {}} = this.props;
        return Ex.xuiContainer($container, UI, Ex.yoAmbient(this), () => {
            /*
             * 其他 render 逻辑在此处处理
             */
            const inherit = Op.yoPage(this);
            /*
             * 使用 grid 执行 control 中的配置和数据连接
             */
            const {$grid = []} = this.state;
            /*
             * $opened for CI configuration
             */
            return Ex.xuiGrid($grid, UI, inherit);
        });
    }
}

export default Component