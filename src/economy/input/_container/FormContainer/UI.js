import React from 'react';
import Op from './Op';
import Ux from 'ux';
import renderJsx from './Web';

class Component extends React.PureComponent {
    state = {};

    componentDidMount() {
        Op.yiInit(this);
    }

    render() {
        return Ux.xtRender(this, () =>
            renderJsx(this))
    }
}

export default Component;