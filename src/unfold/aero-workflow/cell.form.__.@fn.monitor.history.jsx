import React from "react";
import {TxHistory} from '../aero-extenion';

export default (reference) => () => {
    const {$inited = {}} = reference.props;
    const data = $inited.history ? $inited.history : [];
    data.forEach(history => {
        // 开单人
        history.openBy = $inited.openBy;
    });
    return (
        <TxHistory data={data}/>
    )
}