import Ux from "ux";
import {LoadingAlert} from "web";
import React from "react";
import {Col, Empty, Row, Tabs} from "antd";
import UiTable from "./UI.Table";
import Op from "../Op";

const renderBlockTitle = (reference, $selected) => {
    const {
        $dataDir = [], $dataBag = [],
        // $selectedBlock
        $selectedBlock,
    } = reference.state;
    const data = Ux.elementUnique($dataDir, 'key', $selected);
    const dataSub = Ux.elementUnique($dataBag, 'key', $selectedBlock);
    const info = Ux.fromHoc(reference, "info");
    return (
        <Row className={"header"}>
            <Col span={2} className={"label"}>
                {info['bagSelected']}
            </Col>
            <Col span={10} className={"content"}>
                <img src={Ux.Env.ICON_BLOCK[data['uiIcon']]} alt={data.name}/>
                &nbsp;&nbsp;
                <span className={"content-text"}>
                    <label className={"title"}>
                        {data["name"]}
                    </label>
                    <label>
                        {data["nameAbbr"]} - {data["nameFull"]}
                    </label>
                </span>
            </Col>
            <Col span={2} className={"label"}>
                {info['blockSelected']}
            </Col>
            <Col span={10} className={"content"}>
                <img src={Ux.Env.ICON_BLOCK[dataSub['uiIcon']]} alt={dataSub.name}/>
                &nbsp;&nbsp;
                <span className={"content-text"}>
                    <label className={"title"}>
                        {dataSub["name"]}
                    </label>
                    <label>
                        {dataSub["nameAbbr"]} - {dataSub["nameFull"]}
                    </label>
                </span>
            </Col>
        </Row>
    )
}

const renderBlockTable = (reference, block = [], bag = {}) => {
    const data = block.sort(Ux.sorterAscTFn("uiSort"))
    return (
        <UiTable data={data}
                 $executor={Op.yoExecutors(reference)}
                 $plugins={Op.yoPlugins(reference, bag)}
                 $renders={{
                     name: (inherit) => {
                         const {data = {}} = inherit;
                         return (
                             <div className={"block-name"}>
                                 <img src={Ux.Env.ICON_BLOCK[data['uiIcon']]} alt={data.name}/>
                                 &nbsp;&nbsp;
                                 <label>{data.name}</label>
                             </div>
                         )
                     }
                 }}/>
    );
}

// 模块渲染主界面
const renderBlockContent = (reference, $selected) => {
    const {$dataBag = [], $selectedBlock} = reference.state;
    const filtered = $dataBag
        .filter(item => $selected === item.parentId)
        .sort(Ux.sorterAscTFn("uiSort"));
    const empty = Ux.fromHoc(reference, "empty");
    if (0 === filtered.length) {
        return (
            <Tabs tabPosition={"left"}>
                <Tabs.TabPane key={"emptyTab"} tab={
                    <div className={"tab-title"}>
                        <img src={Ux.Env.ICON_SYS.CM_MORE} alt={empty.img}/>
                    </div>
                }>
                    <Empty description={empty.description}/>
                </Tabs.TabPane>
            </Tabs>
        )
    } else {
        return (
            <Tabs tabPosition={"left"}
                  activeKey={$selectedBlock}
                  onTabClick={($selectedBlock) => reference.setState({$selectedBlock})}>
                {filtered.map(item => (
                    <Tabs.TabPane key={item.key} tab={
                        <div className={"tab-title"}>
                            <img src={Ux.Env.ICON_BLOCK[item['uiIcon']]} alt={item.name}/>
                            <span>{item.name}</span>
                        </div>
                    }>
                        {(item.block && 0 < item.block.length) ?
                            renderBlockTable(reference, item.block, item) :
                            (<Empty description={empty.block}/>)}
                    </Tabs.TabPane>
                ))}
            </Tabs>
        )
    }
}
export default (reference) => {
    const {$selectedBag} = reference.state;
    const info = Ux.fromHoc(reference, "info");
    if ($selectedBag) {
        return (
            <div className={"block-content"}>
                {renderBlockTitle(reference, $selectedBag)}
                <hr/>
                {renderBlockContent(reference, $selectedBag)}
            </div>
        )
    } else {
        return (
            <div className={"block-intro"}>
                <LoadingAlert $alert={info.alert}/>
            </div>
        )
    }
}