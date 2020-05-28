import React from 'react';
import Op from '../op';
import Ux from 'ux';

import LoadingContent from "../../../loading/LoadingContent/UI";

class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiGrid(this);
    }

    render() {
        return Ux.xtReady(this, () => {

        }, {component: LoadingContent})
    }
}

export default Component