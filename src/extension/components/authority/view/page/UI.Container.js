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
            const {$data = {}, $config} = this.state;
            return React.cloneElement(children, {
                data: $data,
                config: $config,
            })
        }, Ex.parserOfColor("Rule-Container").container())
    }
}

export default Component