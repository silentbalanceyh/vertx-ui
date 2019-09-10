import React from 'react';
import Ux from 'ux';
import './Cab.less';

export default (reference, {
    $navs = [],
    $router,
    css: {
        clsNav = "ux-navigation",
        clsBreadcrumb = "breadcrumb"
    }
}) => (
    <div className={clsNav}>
        {Ux.aiBreadcrumb($navs, {
            className: clsBreadcrumb
        }, {
            $router,
        })}
    </div>
)