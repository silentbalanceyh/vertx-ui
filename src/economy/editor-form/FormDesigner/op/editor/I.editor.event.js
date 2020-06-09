import Ux from "ux";
import CellEvent from './I.editor.event.cell';
import RowEvent from './I.editor.event.row';

export default {
    ...RowEvent,
    ...CellEvent,
    rxSettingClose: (reference) => (event) => {
        Ux.prevent(event);
        reference.setState({
            $drawer: undefined,
            $setting: undefined
        })
    },
    /*
     * 专用合并函数
     */
    rxRequest: (reference) => {
        /* 旧数据 */
        const {raft = {}, child} = reference.state;
        if (child) {
            const updated = child.state.$rows;
            /* 新旧数据合并 */
            console.info(raft, updated);
        } else {
            throw new Error("绑定出错，无法加载子组件数据！");
        }
    }
}
