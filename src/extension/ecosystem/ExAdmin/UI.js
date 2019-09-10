import React from 'react';
import Ux from "ux";
import Op from './Op';

import renderJsx from './Web.jsx';

class Component extends React.PureComponent {
    state = {
        $collapsed: true, // 默认将菜单收起来
    };

    componentDidMount() {
        Op.yiLayout(this);
    }

    render() {
        Ux.dgDebug(this.props, "[ ExAdmin ] ", "#c60");
        const {config = {}, children} = this.props;
        const {homepage, banner} = config;

        const siders = Op.yoSider(this);
        const navigations = Op.yoNavigation(this, {homepage});
        const headers = Op.yoHeader(this, {banner});

        return renderJsx(this, {
            children,
            siders,
            navigations,
            headers,
        })
    }
}

export default Component;