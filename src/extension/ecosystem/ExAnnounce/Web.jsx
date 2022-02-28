import Ux from "ux";
import {Button, Card, Carousel, Tooltip} from "antd";
import React from "react";
import renderHTML from "react-render-html";
import ExAnnounceView from '../ExAnnounceView/UI'

const renderAction = (reference, item = {}) => {
    const action = Ux.fromHoc(reference, "action");
    const {$visible = false, $inited = {}} = reference.state;
    return (
        <div className={"action"}>
            <Button.Group size={"small"}>
                <Tooltip title={action.search}>
                    <Button icon={"search"} onClick={event => {
                        Ux.prevent(event);
                        Ux.ajaxGet("/api/x-notice/:key", {key: item.key})
                            .then($inited => reference.setState({$visible: true, $inited}))
                    }}/>
                </Tooltip>
                <Tooltip title={action.link}>
                    <Button icon={"link"} className={"ux-spec"}/>
                </Tooltip>
            </Button.Group>
            <ExAnnounceView data={$inited} visible={$visible} rxClose={(event) => {
                Ux.prevent(event);
                reference.setState({$visible: false, $inited: undefined});
            }}/>
        </div>
    )
}

const renderNotice = (reference, data = []) => {
    return (
        <Carousel>
            {data.map(item => (
                <div key={item.key} className={"ex-content"}>
                    {renderAction(reference, item)}
                    <Card.Meta title={item.name}
                               description={(
                                   <div>
                                       {renderHTML(item.content)}
                                   </div>
                               )}/>
                </div>
            ))}
        </Carousel>
    )
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    renderNotice,
}