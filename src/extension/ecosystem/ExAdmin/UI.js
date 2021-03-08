import React from 'react';
import Op from './Op';
import Ex from 'ex';

import Jsx from './Web.jsx';

/**
 * ## 「组件」`ExAdmin`
 *
 * ```js
 * import { ExAdmin } from 'ei';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * @memberOf module:web-component
 * @method ExAdmin
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const props = reference.props;
    if (props.hasOwnProperty("$collapsed")) {
        const {$collapsed = true} = props;
        reference.setState({$collapsed, $ready: true});
    }
};

class Component extends React.PureComponent {
    state = {
        $collapsed: true, // 默认将菜单收起来
    };

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {config = {}, children} = this.props;
            const {homepage, banner} = config;

            const siders = Op.yoSider(this);
            const navigations = Op.yoNavigation(this, {homepage});
            const headers = Op.yoHeader(this, {banner});
            return Jsx.renderTpl(this, {
                children,
                siders,
                navigations,
                headers,
            })
        }, Ex.parserOfColor("ExAdmin").tpl());
    }
}

export default Component;