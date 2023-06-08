import Ux from "ux";
import {Card, Col, Row} from "antd";
import React from "react";

const renderBagAction = (reference, data) => {
    const {$selectedBag, $dataBag = []} = reference.state;
    const info = Ux.fromHoc(reference, "info");
    const active = data.key === $selectedBag;
    return (
        // eslint-disable-next-line
        <a href={""} className={active ? "active" : "inactive"} onClick={event => {
            Ux.prevent(event);
            const dataBag = $dataBag
                .filter(item => data.key === item.parentId)
                .sort(Ux.sorterAscTFn('uiSort'));
            const state = {$selectedBag: data.key};
            if (0 < dataBag.length) {
                const found = dataBag[0] ? dataBag[0] : {};
                if (found.key) {
                    state.$selectedBlock = found.key;
                }
            }
            if (!state.hasOwnProperty("$selectedBlock")) {
                state.$selectedBlock = undefined;
            }
            // reference.?etState(state);
            Ux.of(reference).in(state).done();
        }}>
            {active ?
                Ux.v4Icon("folder-open", {style: {fontSize: 16}}) :
                Ux.v4Icon("folder", {style: {fontSize: 16}})
            }
            &nbsp;&nbsp;
            {info['bagAction']}
        </a>
    );
}

const renderBagDetail = (reference, data) => {
    return (
        <Col span={4} className={"ux_bag"} key={data.key}>
            <Card cover={
                <Row>
                    <Col span={10} className={"bag-icon"}>
                        <img src={Ux.Env.ICON_BLOCK[data['uiIcon']]} alt={data.name}/>
                    </Col>
                    <Col span={14}>
                        <ul className={"bag-list"}>
                            <li className={"title"}>{data.name}</li>
                            <li className={"abbr"}>{data['nameAbbr']}</li>
                            <li className={"action"}>
                                {renderBagAction(reference, data)}
                            </li>
                        </ul>
                    </Col>
                </Row>
            }>
                <Card.Meta description={data['nameFull']}/>
            </Card>
        </Col>
    )
}
export default (reference) => {
    const {$dataDir = []} = reference.state;
    const data = Ux.elementGrid($dataDir, 6);
    return data.map((dataItem, index) => (
        <Row key={`rowBag${index}`}>
            {dataItem.map(data => renderBagDetail(reference, data))}
        </Row>
    ))
}