import React from 'react';
import {Card, Icon, Popconfirm, Tooltip} from 'antd';
import Img from '../images/form.jpg';
import Ux from 'ux';
import Event from '../event';

export default (reference, data = {}) => {
    const card = Ux.fromHoc(reference, "card");
    const {img = {}, actions = []} = card;
    const $metadata = data.metadata ? data.metadata : {};
    return (
        <div className={"item"}>
            <Card cover={(() => {
                const isDisabled = !$metadata['design'];
                return isDisabled ? (
                    <img alt={"Form"} src={Img}/>
                ) : (
                    <Tooltip title={img.tooltip}>
                        <img alt={"Form"} src={Img}
                             onDoubleClick={Event.actions.onDesign(reference, data)}/>
                    </Tooltip>
                )
            })()
            } actions={actions.map(action => {
                const {tooltip, metadata, ...rest} = action;
                /* 是否禁用 */
                let isDisabled = false;
                if ($metadata.hasOwnProperty(metadata)) {
                    isDisabled = !$metadata[metadata];
                }
                const $rest = Ux.clone(rest);
                $rest.disabled = isDisabled;
                /* Css 调试 */
                if (isDisabled) {
                    $rest.className = `${$rest.className} action-disabled`;
                }
                if (isDisabled) {
                    return (<Icon {...$rest}/>)
                } else {
                    const fnClick = Event.actions[$rest.key];
                    if (Ux.isFunction(fnClick)) {
                        if ($rest.hasOwnProperty("confirm")) {
                            const {confirm, ...$lefts} = $rest;
                            return (
                                <Popconfirm title={confirm}
                                            onConfirm={
                                                fnClick(reference, data)
                                            }>
                                    <Tooltip title={tooltip} mouseLeaveDelay={0.01}>
                                        <Icon {...$lefts}/>
                                    </Tooltip>
                                </Popconfirm>
                            )
                        } else {
                            $rest.onClick = fnClick(reference, data);
                            return (
                                <Tooltip title={tooltip}>
                                    <Icon {...$rest}/>
                                </Tooltip>
                            )
                        }
                    } else return false;
                }

            })} className={"card"}>
                <Card.Meta title={data.name}/>
            </Card>
        </div>
    )
}