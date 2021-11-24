import React from 'react';
import Ux from "ux";
import Ex from "ex";
import {Table} from 'antd';
import './Cab.less';

const componentInit = (reference) => {
    const state = {};
    const table = Ux.fromHoc(reference, "table");
    const $table = Ux.clone(table);
    $table.columns = Ux.configColumn(reference, $table.columns);
    $table.className = "web-table";
    state.$ready = true;
    state.$table = $table;
    // 数据
    const {data = []} = reference.props;
    const $data = [];
    data.forEach(dataItem => {
        const each = {};
        each.key = dataItem.key;
        if (dataItem.owner === dataItem['finishedBy']) {
            // 提交申请类型
            if ("CANCELED" === dataItem.status) {
                each.opType = "CANCELED";
            } else {
                each.opType = "REQUESTED";
            }
            each.comment = dataItem.comment;
        } else {
            if ("REJECTED" === dataItem.status) {
                each.opType = "REJECTED";
                each.comment = dataItem['commentReject'];
            } else {
                each.opType = "FINISHED";
                each.comment = dataItem['commentApproval']
            }
        }
        each.opBy = dataItem['finishedBy'];
        each.opAt = dataItem['finishedAt'];
        $data.push(each)
    });
    state.$data = $data;
    // 处理用户数据
    const userId = $data.map(item => item.opBy);
    Ux.ajaxPost("/api/user/search", {
        criteria: {
            "key,i": userId
        }
    }).then(users => {
        const {list = []} = users;
        const $lazy = {};
        list.forEach(each => $lazy[each.key] = each.realname);
        state.$lazy = {opBy: $lazy};
        reference.setState(state);
    })
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("TxHistory")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$table = {}, $data = []} = this.state;
            return (
                <div className={"ex-flow-history"}>
                    <Table {...$table} dataSource={$data}/>
                </div>
            )
        }, Ex.parserOfColor("TxHistory").control());
    }
}

export default Component