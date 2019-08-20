import React from 'react';
import Ux from 'ux';

export default (reference, {
    $navs = [],
    $router,
    css: {
        clsNav = "",
        clsBreadcrumb = ""
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