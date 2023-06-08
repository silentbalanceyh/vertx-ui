import React from 'react';
import Op from './Op';
import renderJsx from './Web';
import __Zn from '../zero.uca.dependency';

class Component extends React.PureComponent {
    state = {};

    componentDidMount() {
        Op.yiInit(this);
    }

    render() {
        return __Zn.xtReady(this, () => renderJsx(this))
    }
}

export default Component;