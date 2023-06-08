import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from "ei";
import Op from './Op'
import {Card, Col, Row} from 'antd';

const renderBag = (reference) => {
    const {$bag = []} = reference.state;
    const $root = $bag.filter(bag => !bag.parentId);
    return $root.map(data => (
        <Row key={data.key} className={"ux_bag"}>
            <Col span={4}>
                <Card cover={
                    <div className={"bag_cover"}>
                        <div className={"icon"}>
                            <img src={Ux.Env.ICON_BLOCK[data['uiIcon']]} alt={data.name}/>
                        </div>
                        <ul className={"list"}>
                            <li className={"title"}>{data.name}</li>
                            <li className={"abbr"}>{data['nameAbbr']}</li>
                        </ul>
                    </div>
                }>
                    <Card.Meta description={data['nameFull']}/>
                </Card>
            </Col>
            <Col span={20}>
                {(() => {
                    const bags = $bag.filter(bag => bag.parentId === data.key);
                    return bags.map(bag => (
                        <div className={"ux_block"} key={bag.key}>
                            <div className={"icon"}>
                                <img src={Ux.Env.ICON_BLOCK[bag['uiIcon']]} alt={bag.name}/>
                            </div>
                            <span>{bag.name}</span>
                        </div>
                    ))
                })()}
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
        Op.componentInit(this);
    }

    render() {
        return Ex.ylCard(this, () => {
            // 从 Localhost中提取数据
            const inited = Ux.isInit();
            const form = Ex.yoForm(this, null, inited);
            const info = Ux.fromHoc(this, "info")
            return (
                <div>
                    <ExForm {...form} $op={Op.actions}/>
                    <div>
                        <Row className={"ux_title"}>
                            {info['bag']}
                        </Row>
                        {renderBag(this)}
                    </div>
                </div>
            )
        }, Ex.parserOfColor("Application.Setting").toolkit())
    }
}

export default Component