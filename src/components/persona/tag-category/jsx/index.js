import React from 'react';
import Ex from 'ex';
import Ux from 'ux';

import {Graphic2} from 'web';
import {Empty} from 'antd';

import renderTree from './render.search';
import UIBasic from './UI.Basic';
import UITable from './UI.Table';

const renderInfo = (reference) => {
    const {$dataBasic = {}} = reference.state;
    const inherit = Ex.yoAmbient(reference);
    let key;
    if (Ux.isEmpty($dataBasic)) {
        key = Ux.randomUUID()
    } else {
        key = "fixForm"
    }
    return (<UIBasic {...inherit} $inited={$dataBasic} key={key}/>)
}
const renderReport = (reference) => {
    const {$dataReport = []} = reference.state;
    const message = Ux.fromHoc(reference, "message");
    return (
        <div className={"report"}>
            {0 === $dataReport.length ? (
                <div className={"empty"}>
                    <Empty description={message.report}/>
                </div>
            ) : (
                <Graphic2 config={{
                    chart: {
                        height: 180
                    }
                }} data={$dataReport} $gid={"ops-report"} $gFn={Ux.g2Bar}/>
            )}
        </div>
    )
}
const renderTable = (reference) => {
    const {$dataBasic} = reference.state;
    const inherit = Ex.yoAmbient(reference);
    return (<UITable {...inherit} data={$dataBasic}/>)
}
export default {
    renderTree,
    renderInfo,
    renderReport,
    renderTable,
}