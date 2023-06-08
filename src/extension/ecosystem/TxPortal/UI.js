import React from 'react';
import {Card, Col, Divider, Row} from 'antd';
import Ux from 'ux';
import Ex from 'ex';
import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "TxPortal";
const renderChild = (reference, child, source) => {
    const children = source
        .filter(item => child.key === item.parentId)
        .sort(Ux.sorterAscTFn('order'));
    return children.map((child, index) => (
        <span key={child.key}>
            {/* eslint-disable-next-line */}
            <a href={""} className={"link"} onClick={event => {
                Ux.prevent(event);
                // 流程路径需要更改，不使用菜单路径
                const {$router} = reference.props;
                // Ux.fn(reference).fnPage(child.uri, {target: $router.path()});
                Ux.toRoute(reference, child.uri, {target: $router.path()});
            }}>
                {Ux.v4Icon(child.icon)}
                &nbsp;&nbsp;
                {child.text}
            </a>
            {index < (children.length - 1) ? (
                <Divider type="vertical"/>
            ) : false}
        </span>
    ));
}

const componentInit = (reference) => {
    Ex.yiAssist(reference).then(state => {
        const {$menus} = reference.props;
        const source = Ex.toArray($menus).filter(item => [
            Ux.Env.MENU_TYPE.SC, // 服务目录
        ].includes(item.type));
        /*
         * SC-MENU + Service Catalog 综合计算，此处的核心逻辑如下:
         * 1) 如果要启用`服务目录`的功能，则必须定义 SC-MENU 类型的菜单
         * 2) 系统会直接提取 service.catalog 级别的菜单
         */
        {
            const catalog = Ux.onDatum({state}, "service.catalog");
            const $data = Ux.clone(source);
            $data.forEach(menu => {
                if (!menu.metadata) {
                    menu.metadata = {};
                }
                const found = Ux.elementUnique(catalog, 'code', menu.name);
                if (found && found.metadata) {
                    Object.assign(menu.metadata, found.metadata);
                }
            })
            state.$data = $data;
        }
        Ux.of(reference).in(state).ready().done();
        // reference.?etState(state);
        // state.$ready = true;
    });
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {config = {}} = this.props;
            const {$data = []} = this.state;
            const minLevel = $data.map(item => item.level)
                .reduce((left, right) => Math.min(left, right));
            // Root 部分（无链接）
            const root = $data
                // .filter(item => !item.parentId)
                .filter(item => item.level === minLevel)
                .sort(Ux.sorterAscTFn('order'));
            const attrCard = Sk.mixTx(UCA_NAME)
            return (
                <div {...attrCard}>
                    <Card title={config.title} className={Ux.Env.ECONOMY.CARD_CONTAINER}>
                        {root.map((each, index) => {
                            const {metadata = {}} = each;
                            const attrs = {};
                            attrs.span = 4;
                            attrs.className = "title";
                            if (metadata.item) {
                                attrs.style = metadata.item;
                            } else {
                                attrs.style = {
                                    backgroundColor: Ex.toColor(index, "SEVEN_7")
                                }
                            }
                            return (
                                <Row key={each.key} className={"row"}>
                                    <Col {...attrs}>
                                        {Ux.v4Icon(each.icon, {
                                            style: {
                                                color: "white"
                                            }
                                        })}
                                        &nbsp;&nbsp;
                                        {each.text}
                                    </Col>
                                    <Col span={20} className={"content"}>
                                        {renderChild(this, each, $data)}
                                    </Col>
                                </Row>
                            );
                        })}
                    </Card>
                </div>
            );
        }, Ex.parserOfColor(UCA_NAME).control());
    }
}

export default Component