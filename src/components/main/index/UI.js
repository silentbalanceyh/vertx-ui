import React from 'react'
import Ux from 'ux';
import {PageCard} from 'web';
import Sk from "skin";
import Ex from "ex";
import {ExAnnounce, MyMenu} from "ei";
import __ from './Cab.module.scss';
import {Col,Layout, Row} from 'antd';

const renderMenuMy = (reference, source = []) => {
    // 配置
    const attrs = Ex.yoAmbient(reference);
    attrs.config = Ux.fromHoc(reference, "shortcut");
    // 数据
    attrs.source = source.filter(item =>
        // 左菜单 / 引导菜单
        ["SIDE-MENU", "NAV-MENU"].includes(item.type))
    return (
        <MyMenu {...attrs}/>
    )
}

const renderNotice = (reference) => {
    const attrs = Ex.yoAmbient(reference);
    attrs.config = Ux.fromHoc(reference, "notice");
    return (
        <ExAnnounce {...attrs}/>
    )
}
@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const {$menus} = this.props;
        const attrs = Sk.mix(__.hm_interval);
        let source = $menus.is() ? $menus.to() : [];
        return (
            <Layout {...Sk.mix(__.hm_login, () => ({
            }))}>
                <div>
                    <Row {...attrs}>
                        <Col span={24} className={"hm_interval"}>
                            {/* 快捷方式 */}
                            {renderMenuMy(this, source)}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} className={"hm_interval"}>
                            {/* 公告栏 */}
                            {renderNotice(this)}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} className={"hm_interval"}>
                            <PageCard reference={this} $key={"dashboard.todo"}>
                            </PageCard>
                        </Col>
                    </Row>
                </div>
            </Layout>
        );
    }
}

export default Component