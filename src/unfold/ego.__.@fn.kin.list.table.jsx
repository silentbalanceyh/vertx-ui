import Rdr from './ego.__.fn.kin.list.table.segment';
import Evt from './ego.fn.kin.event';
import Ux from 'ux';
import {Table} from "antd";

export default (reference) => {
    const {
        $table = {},
        $data = {},
        // $spinning = false
    } = reference.state;

    /*
     * 分页
     */
    const table = Ux.clone($table);
    table.pagination = Rdr.renderPager(reference, $data);

    /*
     * 选中项
     */
    const rowSelection = Rdr.renderSelection(reference);
    if (rowSelection) {
        table.rowSelection = rowSelection;
    }

    table.columns = Rdr.renderColumn(reference, $table.columns);

    // table.loading = $spinning;
    const dataSource = Ux.valueArray($data);
    table.dataSource = dataSource;
    table.onChange = Evt.kinTChange(reference);
    {
        // 双击
        const {row = {}} = $table;
        table.onRow = Evt.kinTRow(reference, row);
        if (row.onDoubleClick) {
            table.rowClassName = "ux_op_dbclick";
        }
    }
    /*
     * 修改 x
     */
    Ux.configScroll(table, dataSource, reference);
    return (
        <div>
            <Table {...table}/>
        </div>
    )
}