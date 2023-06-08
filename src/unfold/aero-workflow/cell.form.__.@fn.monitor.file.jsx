import React from 'react';
import {Empty, Timeline} from "antd";
import Ux from 'ux';

export default (reference) => ($inited, config = {}) => {
    /*
         * $openAppr / $openFile
         */
    const {history = []} = $inited;
    const approvals = history.filter(each => "ATTACHMENT" === each.type)
        .sort(Ux.sorterDescDFn('createdAt'));
    if (0 === approvals.length) {
        return (<Empty/>)
    } else {
        const {format} = config;
        const items = [];
        approvals.forEach(approval => {
            const item = {};
            item.key = approval.key;
            const timeAt = Ux.valueDatetime(approval['createdAt']);
            item.children = (
                <>
                    <p>{timeAt.format(format)}</p>
                    <p>{approval.description}</p>
                </>
            );
            items.push(item);
        })
        return (
            <Timeline items={items}/>
        )
    }
}