import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import Op from './Op';

class Component extends React.PureComponent {
    state = {};

    componentDidMount() {
        Op.yiModule(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yuModule(this, {state: prevState, props: prevProps});
    }

    render() {
        return Ex.yoRender(this, () => {
            /*
             * 读取 $control 配置
             */
            const {$config = {}, $identifier} = this.state;
            /*
             * 提取 children 的 props.config
             */
            const {children} = this.props;
            let config = {};
            if (children.props) {
                config = children.props.config;
            }
            Object.assign(config, $config);
            return Ux.aiChildren(this, {
                /*
                 * 配置基本信息
                 */
                config,
                /*
                 * 当前组件处理的 $identifier（模型ID）
                 */
                $identifier,
            })

        }, Ex.parserOfColor("OxModule").container())
    }
}

export default Component;