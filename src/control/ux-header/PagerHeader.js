import './Cab.less'
import React from 'react'
import Ux from 'ux'
import { Breadcrumb } from 'antd';

class Component extends React.PureComponent {
    render() {
        const { $router, $navs = [] } = this.props;
        return (
            <Breadcrumb className="breadcrumb">
                {/** Breadcrumb导航栏 **/}
                {$navs.map(item => Ux.uiItemBreadcrumb(item, $router))}
            </Breadcrumb>
        )
    }
}

export default Component;
