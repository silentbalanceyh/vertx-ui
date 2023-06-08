import React from 'react';
import Ux from "ux";
import __Zn from "../zero.aero.dependency";
import {Table} from 'antd';
import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "TxHistory";

const componentInit = (reference) => {
    const state = {};
    const table = Ux.fromHoc(reference, "table");
    const $table = Ux.clone(table);
    $table.columns = Ux.configColumn(reference, $table.columns);
    $table.className = "ux_table";
    $table.scroll = {
        x: "max-content"
    }
    state.$table = $table;
    // 数据
    const {data = []} = reference.props;
    /*
     * key - 主键
     * serial - 记录编号
     * taskName - 任务名称
     * taskSerial - 任务单号
     * createdBy - 操作人
     * createdAt - 操作时间
     * description - 操作内容
     */
    // 处理用户数据
    const userId = data.map(item => item.createdBy);
    Ux.ajaxPost("/api/user/search", {
        criteria: {
            "key,i": userId
        }
    }).then(users => {
        const {list = []} = users;
        const $lazy = {};
        list.forEach(each => $lazy[each.key] = each.realname);
        state.$lazy = {createdBy: $lazy};

        Ux.of(reference).in(state).ready().done();
        // reference.?etState(state);
    })
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return __Zn.yoRender(this, () => {
            const {$table = {}} = this.state;
            const {data = []} = this.props;
            const dataSource = Ux.clone(data.sort(Ux.sorterDescFn("serial")));
            const attrTx = Sk.mixTx(UCA_NAME);
            return (
                <div {...attrTx}>
                    <Table {...$table} dataSource={dataSource}/>
                </div>
            )
        }, __Zn.parserOfColor(UCA_NAME).control());
    }
}

// Fix issue of Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?
// 如果需要外包装成表单级getFieldDecorator，就必须多加一层
// 主要是存在 @zero 注解的表单必须如此操作
// class Wrap extends React.PureComponent {
//     render() {
//         return (
//             <Component {...this.props}/>
//         )
//     }
// }

export default Component