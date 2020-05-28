import Cmn from "./I.common";
import Ux from 'ux';

export default {
    /*
     * 网格初始化
     */
    yiGrid: (reference) => {
        // const {data = {}} = reference.props;
        /* 初始化配置信息 */
        /* Form数据处理 */
        const state = {};
        /* _commands 命令工具栏 */
        state.$ready = true;

        /* 初始化行专用操作 */
        state.$rows = [{}];
        reference.setState(state);
    },
    yiGridRow: (reference) => {
        const state = {};
        Cmn.yiCommand(reference, state)
            .then(Ux.ready).then(Ux.pipe(reference))
    },
    rxRowDel: (reference) => (rowIndex) => {
        let {$rows = []} = reference.state;
        $rows = Ux.clone($rows);
        $rows = $rows.filter((row, index) => rowIndex !== index);
        reference.setState({$rows});
    },
    rxRowAdd: (reference) => (rowIndex) => {
        let {$rows = []} = reference.state;
        $rows = Ux.clone($rows);
        /* 在指定位置插入 */
        if (undefined === rowIndex) {
            rowIndex = $rows.length - 1;
        }
        $rows.splice(rowIndex, 0, {});
        reference.setState({$rows});
    }
}