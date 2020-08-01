import React from 'react';
import Op from './Op';
import Ex from 'ex';

class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {children} = this.props;
            const {$data = {}, $config, $keySet, $views} = this.state;
            const inherit = {};
            inherit.data = $data;
            inherit.config = $config;
            if ($views) {
                // 分组处理
                inherit.$views = $views;
            } else {
                // 不分组处理
                inherit.$keySet = $keySet;
            }
            return React.cloneElement(children, inherit)
        }, Ex.parserOfColor("Rule-Container").container())
    }
}

export default Component