import React from 'react';
import Ux from "ux";
import Ex from "ex";
import './Cab.less';
import {Card, Col, Row} from "antd";

const componentInit = (reference) => {
    Ux.ajaxGet("/api/bag").then(response => {
        const state = {};
        state.$ready = true;
        // 只过滤特殊类型的包
        const source = response
            .filter(item => "Z-KERNEL" !== item.type)
            .sort(Ux.sorterAscTFn("uiSort"));
        // 只处理 source 部分的内容
        state.$dataDir = source
            .filter(item => !item.parentId)
            .sort(Ux.sorterAscTFn("uiSort"));

        let dataZ = [];
        let dataT = [];
        source.forEach(item => {
            if (["Z-FOUNDATION", "Z-COMMERCE"].includes(item.type)) {
                const block = item.block ? item.block : [];
                block.forEach(each => each.rootId = item.parentId);
                dataZ = dataZ.concat(block.sort(Ux.sorterAscTFn('uiSort')));
            } else {
                const block = item.block ? item.block : [];
                block.forEach(each => each.rootId = item.parentId);
                dataT = dataT.concat(block.sort(Ux.sorterAscTFn('uiSort')));
            }
        });
        // 每个节点读取
        state.$dataZ = dataZ;
        state.$dataT = dataT;
        reference.setState(state);
    })
}

const renderBlock = (reference, data = {}) => {
    const action = Ux.fromHoc(reference, "action");
    return (
        <div className={"block"} key={data.key}>
            <div>
                <img src={Ux.Env.ICON_BLOCK[data['uiIcon']]} alt={data.name}/>
            </div>
            <span>{data.name}</span>
            {/* eslint-disable-next-line */}
            <a href={""}>
                {action.configure}
            </a>
        </div>
    )
}

const renderBag = (reference, block = []) => {
    const {$dataDir = []} = reference.state;
    const keys = block.map(bk => bk.rootId);
    const source = $dataDir.filter(item => keys.includes(item.key));
    return source.map(data => (
        <Row key={data.key}>
            <Col span={4} className={"bag-info"}>
                <Card cover={
                    <Row>
                        <Col span={10} className={"bag-icon"}>
                            <img src={Ux.Env.ICON_BLOCK[data['uiIcon']]} alt={data.name}/>
                        </Col>
                        <Col span={14}>
                            <ul className={"bag-list"}>
                                <li className={"title"}>{data.name}</li>
                                <li className={"abbr"}>{data['nameAbbr']}</li>
                            </ul>
                        </Col>
                    </Row>
                }>
                    <Card.Meta description={data['nameFull']}/>
                </Card>
            </Col>
            <Col span={20}>
                {block.filter(item => data.key === item.rootId).map(bk => {
                    return renderBlock(reference, bk);
                })}
            </Col>
        </Row>
    ))
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.ylCard(this, () => {
            const {$dataZ = [], $dataT = []} = this.state;
            const panel = Ux.fromHoc(this, "panel");
            return (
                <div className={"dx-module-config"}>
                    <Row>
                        <Col span={24} className={"ux-title ux-title-pure"}>
                            {panel['zero']}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            {renderBag(this, $dataZ)}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} className={"ux-title ux-title-pure"}>
                            {panel['extension']}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            {renderBag(this, $dataT)}
                        </Col>
                    </Row>
                </div>
            )
        }, Ex.parserOfColor("Application.Module").toolkit())
    }
}

export default Component