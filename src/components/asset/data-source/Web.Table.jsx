import {Col} from "antd";
import {Fn, OpsTableList, OpsViewTable} from "app";
import Ex from "ex";
import React from "react";
import Op from "./Op";

export default (reference, data = {}) => {
    return (
        <Col span={19} className={"ops-range"}>
            {(() => {
                return (
                    <OpsViewTable {...Ex.yoAmbient(reference)}
                                  $inited={data}
                                  rxRefresh={Op.rxRefresh(reference)}
                                  $type={Fn.Cv.Types.DataTable}/>
                )
            })()}
            <OpsTableList {...Ex.yoAmbient(reference)}
                           data={data}
                           $type={Fn.Cv.Types.DataSource}/>
        </Col>
    )
}