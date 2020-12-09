import React from 'react';
import {ExForm, ExRelation} from 'ei';
import Ex from 'ex';
import Ux from 'ux';
import OxHistory from '../OxHistory/UI';
import OxTopology from '../OxTopology/UI';
import Event from './event';
import fnLink from './web/UI';

const _toHeight = () => {
    const height = document.body.clientHeight;
    const maxHeight = height * 0.618;
    return {
        maxHeight,
        minHeight: maxHeight,
        overflowY: "auto",
        width: "100%",
        paddingRight: 16
    }
};

const tabDetail = reference => () => {
    const {raft, $edition, $inited = {}} = reference.state;
    const inherit = Ex.yoAmbient(reference);
    inherit.config = {form: raft};
    inherit.$edition = $edition;
    inherit.$inited = $inited;
    return (
        <div style={_toHeight()}>
            <ExForm {...inherit}/>
        </div>
    );
};
const tabRelation = reference => () => {
    const {$definition, $inited = {}} = reference.state;
    const inherit = Ex.yoAmbient(reference);
    if ($definition) {
        inherit.$definition = $definition;
    }

    const config = Ux.fromHoc(reference, "relation");
    const {category, ...rest} = config;
    const attrs = Ex.configRelation($inited, {category}, reference);
    attrs.config = Ux.clone(rest);
    attrs.$header = false;

    attrs.$renders = {
        sourceCode: fnLink(reference),
        targetCode: fnLink(reference),
    };

    Object.assign(inherit, attrs);
    return (
        <ExRelation {...inherit}/>
    );
};
const tabHistory = reference => () => {
    const {$inited = {}, $identifier} = reference.state;
    const inherit = Ex.yoAmbient(reference);
    inherit.$inited = $inited;
    inherit.$identifier = $identifier;
    return (
        <div style={_toHeight()}>
            <OxHistory {...inherit}/>
        </div>
    );
};
const tabTopology = reference => () => {
    const {$inited = {}, $identifier} = reference.state;
    const inherit = Ex.yoAmbient(reference);
    inherit.$inited = $inited;
    inherit.$identifier = $identifier;
    /* 处理 $event 配置信息，到 topology 中去合并 */
    inherit.$container = 'web-g6-viewer-dialog';        // 切换图
    // 窗口固定宽度：1150
    inherit.$position = {
        start: {
            x: 152,
            y: 350
        },
        resize: false,    // 固定（一般用于窗口，不执行 resize
    }
    return (
        <div style={_toHeight()}>
            <OxTopology {...inherit} onNodeDoubleClick={Event.onVisit(reference)}/>
        </div>
    )
};
export default {
    tabDetail,
    tabRelation,
    tabHistory,
    tabTopology
}