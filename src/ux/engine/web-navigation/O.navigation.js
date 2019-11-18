import {Button, Tooltip} from 'antd';
import Ut from '../../unity';
import Abs from '../../abyss';
import React from 'react';

const aiLinkMore = (config = {}, reference) => {
    if (config.icon && config.text) {
        return (
            <Tooltip title={config.text}>
                <Button icon={config.icon} shape={"circle"}
                        size={"small"}
                        onClick={(event) => {
                            event.preventDefault();
                            Ut.toRoute(reference, config.uri);
                        }}/>
            </Tooltip>
        )
    } else return false;
};
const aiLinkBack = (reference) => {
    return (
        <Button shape={"circle"} className={"ux-red"} icon={"close"}
                onClick={event => {
                    Abs.prevent(event);
                    Ut.toOriginal(reference);
                }}
        />
    )
};
export default {
    aiLinkMore,
    aiLinkBack
}