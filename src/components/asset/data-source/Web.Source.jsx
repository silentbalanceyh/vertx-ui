import {Fn, OpsSourceList, OpsViewSource} from "app";
import Ex from "ex";
import {Col} from "antd";
import React from "react";
import Op from './Op';

export default (reference, data = {}) => {
    const {$refresh} = reference.state;
    return (
        <Col span={19} className={"ops-range"}>
            {(() => {
                return (
                     <OpsViewSource {...Ex.yoAmbient(reference)}
                                   $inited={data}
                                   $refresh={$refresh}
                                   rxRefresh={Op.rxRefresh(reference)}
                                   $type={Fn.Cv.Types.DataSource}/>
                )
            })()}
            <OpsSourceList {...Ex.yoAmbient(reference)}
                           data={data.children ? data.children : []}
                           $type={Fn.Cv.Types.DataSource}/>
        </Col>
    )
}