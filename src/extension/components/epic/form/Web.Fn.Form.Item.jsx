import React from 'react';
import {Card, Icon, Tooltip} from 'antd';
import Img from './images/form.jpg';
import Ux from 'ux';
import Event from './event';

export default (reference, data = {}) => {
    const card = Ux.fromHoc(reference, "card");
    const {img = {}, actions = []} = card;
    const $metadata = data.metadata;
    return (
        <div className={"item"}>
            <Card cover={(() => {
                const isDisabled = !$metadata.edition;
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
                const fnClick = Event.actions[$rest.key];
                if (Ux.isFunction(fnClick)) {
                    $rest.onClick = fnClick(reference, data);
                }
                return isDisabled ? (
                    <Icon {...$rest}/>
                ) : (
                    <Tooltip title={tooltip}>
                        <Icon {...$rest}/>
                    </Tooltip>
                )
            })} className={"card"}>
                <Card.Meta title={data.name}/>
            </Card>
        </div>
    )
}