import React from 'react';
import Ux from "ux";
import {Popconfirm, Table} from "antd";
import Ex from "ex";

const UCA_NAME = "FPaymentList";
const mountOp = (reference, columns = []) => {
    let $columns = Ux.configColumn(reference, columns);
    const {rxPayment} = reference.props;
    if (Ux.isFunction(rxPayment)) {
        $columns.forEach(column => {
            if ("key" === column.dataIndex) {
                column.render = (key) => {
                    const {config = {}} = column;
                    const {confirm, text} = config;
                    return (
                        <Popconfirm title={confirm} onConfirm={event => {
                            Ux.prevent(event);
                            Ux.ajaxDelete("/api/payment/cascade/:key", {key})
                                .then(() => rxPayment([key]))
                        }}>
                            {/* eslint-disable-next-line */}
                            <a href={""}>
                                {Ux.v4Icon("delete")}
                                &nbsp;
                                {text}
                            </a>
                        </Popconfirm>
                    );
                }
            }
        })
    } else {
        $columns = $columns.filter(item => "key" !== item.dataIndex);
    }
    return $columns;
}

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        const {$assist = true} = this.props;
        if ($assist) {
            Ex.yiAssist(this)
                .then(Ux.ready)
                .then(Ux.pipe(this));
        } else {
            // 表单级处理
            Ux.of(this).ready().done();
            // this.?etState({$ready: true});
        }
    }

    render() {
        return Ex.yoRender(this, () => {
            const {data = []} = this.props;
            const table = Ux.fromHoc(this, "table");
            table.columns = mountOp(this, table.columns);

            let dataSource = Ux.clone(data);
            dataSource.forEach(each => each.amount = Math.abs(each.amount))
            Ux.configScroll(table, dataSource, this);

            dataSource = dataSource.sort(Ux.sorterDescFn('updatedAt'))
            return (
                <Table {...table} dataSource={dataSource}/>
            )
        }, Ex.parserOfColor(UCA_NAME).control())
    }
}

export default Component