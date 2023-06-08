import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import ExDevTool from '../ExDevTool/UI';
import ExNavigation from "../ExNavigation/UI";
import ExSider from "../ExSider/UI";
import {Layout} from "antd";
import ExHeader from "../ExHeader/UI";

import {ProConfigProvider} from '@ant-design/pro-components';

const UCA_NAME = "ExAdmin";
const {Content} = Layout;
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
 * @memberOf module:uca/extension
 * @method ExAdmin
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const props = reference.props;
    if (props.hasOwnProperty("$collapsed")) {
        const {$collapsed = true} = props;
        Ux.of(reference).in({$collapsed}).ready().done();
        // state.$ready = true;
        // reference.?etState({$collapsed, $ready: true});
    }
};

class Component extends React.PureComponent {
    displayName = UCA_NAME;
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
            <ProConfigProvider hashed={false}>
                {Ex.yoRender(this, () => {
                    const {config = {}, children, $navExtra} = this.props;
                    const {homepage, banner} = config;

                    const siders = Ex.yoTplSider(this);
                    const navigations = Ex.yoTplNavigation(this, {
                        homepage, extra: $navExtra
                    });
                    const headers = Ex.yoTplHeader(this, {banner});
                    return (
                        <Layout className={"ux-layout"}>
                            <ExSider css={
                                {
                                    clsSider: "ux-sider",
                                    clsSiderExpand: "ux-sider-expand"
                                }
                            } {...siders}/>
                            <Layout>
                                <ExHeader {...headers}/>
                                <Content className={"sv-content"}>
                                    <ExNavigation {...navigations} css={
                                        {
                                            clsNav: "ux-navigation",
                                            clsBreadcrumb: "breadcrumb",
                                        }
                                    }/>
                                    {children}
                                </Content>
                            </Layout>
                        </Layout>
                    )
                }, Ex.parserOfColor(UCA_NAME).tpl())}
                {/* 开发工具专用，DEV_MONITOR 开启时使用 */}
                {Ux.DevTool(this).render(ExDevTool)}
            </ProConfigProvider>
        )
    }
}

export default Component;