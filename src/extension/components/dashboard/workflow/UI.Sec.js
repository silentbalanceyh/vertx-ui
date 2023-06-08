import React from 'react';
import Ux from "ux";
import renderTable from './UI.Rdr';
import {ProCard} from "@ant-design/pro-components";

@Ux.zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI.Sec")
    .to()
)
class Component extends React.PureComponent {

    render() {
        const page = Ux.inHoc(this, "page");
        const {data = []} = this.props;
        // 在这里对 data 进行筛选，只获取'安全管理待办工单'的数据
        const filteredData = data.filter(item => item.type === "workflow.approval");
        return (
            <ProCard title={page.title}>
                {renderTable(this, filteredData)}
            </ProCard>
        )
    }
}

export default Component