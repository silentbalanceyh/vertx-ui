import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import Op from './Op';

const LOG = {
    name: "OxModule",
    color: "#00868B"
};

class Component extends React.PureComponent {
    state = {};

    componentDidMount() {
        Op.yiModule(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            /*
             * 读取 $control 配置
             */
            const {$config = {}} = this.state;
            return Ux.aiChildren(this, {
                config: $config,
            })
        }, LOG)
    }
}

export default Component;