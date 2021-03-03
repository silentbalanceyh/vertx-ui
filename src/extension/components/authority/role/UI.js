import React from 'react'
import Ux from "ux";
import Ex from "ex";
import Op from './op';

import renderNav from './Web.Nav';

import './Cab.less';
import {Col, Row, Spin, Tabs} from "antd";

@Ux.zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        window.addEventListener("resize", Ux.rxResize(this, Op.ADJUST));
        Op.yiPage(this)
    }

    componentWillUnmount() {
        window.removeEventListener("resize", Ux.rxResize(this, Op.ADJUST));
    }

    render() {
        return Ex.ylCard(this, () => {
            const info = Ux.fromHoc(this, "info")
            const {$submitting = false, __dialog} = this.state;
            return (
                <div className={"web-authority-role"}>
                    {__dialog.render()}
                    <Spin spinning={$submitting} tip={info.submitting}>
                        {renderNav(this)}
                        <Row>
                            <Col span={24}>
                                {(() => {
                                    const {$tabs = {}, $tree = []} = this.state;
                                    const {items = [], ...tabAttrs} = $tabs;
                                    return (
                                        <Tabs {...tabAttrs} onTabClick={Op.rxPageMove(this)}>
                                            {items.map(item => {
                                                const {render, ...rest} = item;
                                                /*
                                                 * 构造相关数据
                                                 */
                                                const data = Ux.elementUnique($tree, 'key', item.key);
                                                const children = Ux.isArray(data.children) ? data.children : []
                                                return (
                                                    <Tabs.TabPane {...rest}>
                                                        {Ux.isFunction(render) ? render(children, item) : false}
                                                    </Tabs.TabPane>
                                                )
                                            })}
                                        </Tabs>
                                    );
                                })()}
                            </Col>
                        </Row>
                    </Spin>
                </div>
            )
        }, Ex.parserOfColor("PxAuthority-Role").page({
            extra: Ux.aiLinkBack(this)
        }))
    }
}

export default Component