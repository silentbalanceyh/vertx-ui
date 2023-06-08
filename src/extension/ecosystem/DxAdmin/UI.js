import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import ExDevTool from '../ExDevTool/UI';
import ExNavigation from "../ExNavigation/UI";
import DxSider from "../DxSider/UI";
import {Layout} from "antd";
import DxHeader from "../DxHeader/UI";

const UCA_NAME = "DxAdmin";
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
        Ux.of(reference).in({$collapsed}).ready().done()
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
            <div>
                {Ex.yoRender(this, () => {
                    const {config = {}, children} = this.props;
                    const {homepage, banner} = config;

                    const siders = Ex.yoTplSider(this);
                    const navigations = Ex.yoTplNavigation(this, {
                        homepage,
                        extra: "Zero Framework - Development Environment 「 Version 1.0.0 」"
                    });
                    const headers = Ex.yoTplHeader(this, {banner});
                    return (
                        <Layout className={"dx-layout"}>
                            <DxSider css={
                                {
                                    clsSider: "dx-sider",
                                    clsSiderExpand: "dx-sider-expand"
                                }
                            } {...siders}/>
                            <Layout>
                                <DxHeader {...headers}/>
                                <Content className={"dx-content"}>
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
            </div>
        )
    }
}

export default Component;