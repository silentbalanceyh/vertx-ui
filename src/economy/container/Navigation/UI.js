import React from 'react';
import Ux from 'ux';
import './Cab.less';

class Component extends React.PureComponent {
    render() {
        const {$router, $navs = []} = this.props;
        return (
            <div className={"web-navigation"}>
                {Ux.aiBreadcrumb($navs, {className: "breadcrumb"}, {$router})}
            </div>
        );
    }
}

export default Component;
