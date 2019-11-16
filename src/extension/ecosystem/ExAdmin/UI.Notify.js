import React from 'react'
import renderJsx from './Web.Notify.jsx';
import Ex from 'ex';

class Component extends React.PureComponent {
    state = {$ready: true};

    render() {
        return Ex.yoRender(this, () => renderJsx(this, {}),
            Ex.parserOfColor("ExNotify").private());
    }
}

export default Component
