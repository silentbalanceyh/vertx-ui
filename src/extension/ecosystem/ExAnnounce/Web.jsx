import Ux from "ux";
import {Button, Card, Carousel} from "antd";
import React from "react";
import renderHTML from "react-render-html";
import ExAnnounceView from '../ExAnnounceView/UI'

const renderView = (reference) => {
    const {$visible = false, $inited = {}} = reference.state;
    return (
        <div className={"action"}>
            <ExAnnounceView data={$inited}
                            visible={$visible}   //  窗口关闭
                            rxClose={(event) => {
                                Ux.prevent(event);
                                Ux.of(reference).in({
                                    $inited: undefined
                                }).hide().done()
                                // reference.?etState({$visible: false, $inited: undefined});
                            }}/>
        </div>
    )
}

const renderNotice = (reference, data = []) => {
    const {$activeKey, $visible = false} = reference.state;
    const itemActive = $visible ? Ux.elementUnique(data, 'key', $activeKey) : null;
    return (
        <div>
            {/* 解决公告详情黑屏问题 */}
            {itemActive ? renderView(reference, itemActive) : false}
            <Carousel afterChange={dataIndex => {
                const dataItem = data[dataIndex];
                const state = {};
                state.$activeKey = dataItem.key;
                Ux.of(reference).in(state).done();
                // reference.?etState(state);
            }}>
                {data.map(item => (
                    <div key={item.key} className={"content"}>
                        <Card.Meta title={item.name}
                                   description={(
                                       <div className={"content_view"}>
                                           {/* Fix:  Cannot read properties of undefined (reading 'length') */}
                                           {renderHTML(item.content ? item.content : "")}
                                       </div>
                                   )}/>
                    </div>
                ))}
            </Carousel>

        </div>
    )
}
// Fix: https://github.com/silentbalanceyh/ox-engine/issues/1198
const renderExtra = (reference) => {
    const {$activeKey} = reference.state;
    // 公告详情
    const action = Ux.fromHoc(reference, "action");
    const attrs = {};
    attrs.disabled = !$activeKey;
    attrs.icon = Ux.v4Icon("search");
    attrs.onClick = (event) => {
        const {$activeKey} = reference.state;
        if ($activeKey) {
            Ux.prevent(event);
            Ux.ajaxGet("/api/x-notice/:key", {key: $activeKey}).then($inited => {
                Ux.of(reference).in({$inited}).open().done()
                // reference.?etState({$visible: true, $inited});
            })
        }
    }
    return (
        <Button {...attrs}>
            {action.view}
        </Button>
    )
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    renderNotice,
    renderExtra,
}