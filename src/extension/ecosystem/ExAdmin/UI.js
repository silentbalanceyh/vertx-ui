import React from 'react';
import Op from './Op';
import Ex from 'ex';

import renderJsx from './Web.jsx';

class Component extends React.PureComponent {
    state = {
        $collapsed: true, // 默认将菜单收起来
    };

    componentDidMount() {
        Op.yiLayout(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {config = {}, children} = this.props;
            const {homepage, banner} = config;

            const siders = Op.yoSider(this);
            const navigations = Op.yoNavigation(this, {homepage});
            const headers = Op.yoHeader(this, {banner});
            console.info(navigations);
            return renderJsx(this, {
                children,
                siders,
                navigations,
                headers,
            })
        }, Ex.parserOfColor("ExAdmin").tpl());
    }
}

export default Component;