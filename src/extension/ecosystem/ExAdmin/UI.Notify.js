import React from 'react'
import Jsx from './Web';
import Ex from 'ex';

class Component extends React.PureComponent {
    state = {$ready: true};

    render() {
        return Ex.yoRender(this, () => Jsx.renderNotify(this, {}),
            Ex.parserOfColor("ExNotify").private());
    }
}

export default Component
