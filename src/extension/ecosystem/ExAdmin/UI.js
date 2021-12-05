import React from 'react';
import Op from './Op';
import Ex from 'ex';
import Ux from 'ux';
import Jsx from './Web.jsx';
import ExDevTool from '../ExDevTool/UI';

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
 * #### 1.1. 布局
 *
 * ```shell
 * |------------------------------------------------|
 * |   Sider   |  Header                     Notify |
 * |  Menu     |------------------------------------|
 * |  Menu     |                                    |
 * |  Menu     |                                    |
 * |  Menu     |                                    |
 * |  Menu     |                                    |
 * |  Menu     |                                    |
 * |------------------------------------------------|
 * ```
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
        Ux.DevTool(this).on();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (Ux.isRoute(this.props, prevProps)) {
            Ux.DevTool(this).clean();
        }
    }

    componentWillUnmount() {
        Ux.DevTool(this).off();
    }

    render() {
        return (
            <div>
                {Ex.yoRender(this, () => {
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
                }, Ex.parserOfColor("ExAdmin").tpl())}
                {/* 开发工具专用，DEV_MONITOR 开启时使用 */}
                {Ux.DevTool(this).render(ExDevTool)}
            </div>
        )
    }
}

export default Component;