import React from 'react';
import Ux from 'ux';

class Component extends React.PureComponent {
    render() {
        const {$router, $navs = []} = this.props;
        return Ux.aiBreadcrumb($navs, {className: "web-breadcrumb"}, {$router});
    }
}

export default Component;
