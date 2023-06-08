import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import ExDevTool from '../ExDevTool/UI';
import Sk from 'skin';
import "./Cab.norm.scss";
import {PageContainer, ProConfigProvider, ProLayout, SettingDrawer, WaterMark} from '@ant-design/pro-components';
// Fix

const UCA_NAME = "ExAdmin";
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
    Ex.yiProSetting(reference)
        .then(Ux.ready).then(Ux.pipe(reference))
        .catch(error => {
            console.trace(error);
            Ux.of(reference).in({
                error: error.message
            }).done();
        });
};

@Ux.zero(Ux.rxEtat(require("./Cab.json"))
    .cab(UCA_NAME)
    .to()
)
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
        const attrMix = Sk.mixEx(UCA_NAME);
        return Ex.yoRender(this, () => {
            const attrLayout = Ex.yoProLayout(this);

            const attrDrawer = Ex.yoProSettingDrawer(this, 'up-layout');
            const attrChildren = Ex.yoProChildren(this);
            const attrWater = Ex.yoProWater();
            const attrPage = Ex.yoProPageHeader(this);

            const {children} = this.props;
            return (
                <div id="up-layout" {...attrMix}>
                    <ProConfigProvider hashed={false}>
                        <ProLayout {...attrLayout}>
                            {children ? (
                                <PageContainer {...attrPage}>
                                    <WaterMark {...attrWater}>
                                        {React.cloneElement(children, attrChildren)}
                                    </WaterMark>
                                </PageContainer>
                            ) : false}
                            {attrDrawer ? (<SettingDrawer {...attrDrawer}/>) : false}
                        </ProLayout>
                        {/* 开发工具专用，DEV_MONITOR 开启时使用 */}
                        {Ux.DevTool(this).render(ExDevTool)}
                    </ProConfigProvider>
                </div>
            )
        }, Ex.parserOfColor(UCA_NAME).tpl())
    }
}

export default Component;