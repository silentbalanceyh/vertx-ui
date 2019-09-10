import raftButtons from './I.fn.buttons';
import raftExtension from './I.fn.extension';

const raftAction = (cell = {}, reference) => {
    /*
     * 显示隐藏的基本处理
     */
    if (!cell.optionJsx) cell.optionJsx = {};
    cell.optionJsx.hidden = !!cell.hidden;
    /*
     * 进行分流解析
     */
    const jsxRef = cell.optionJsx;
    if (jsxRef.buttons) {
        // submit + reset 双按钮
        jsxRef.actions = raftButtons(reference, jsxRef);
    } else if (jsxRef.extension) {
        /*
         * extension 多按钮模式，新模式
         * 带权限控制
         */
        jsxRef.actions = raftExtension(reference, jsxRef);
    } else {
        // 非法
        console.error(cell);
        throw new Error("无法渲染的按钮！")
    }
};
export default {
    raftAction,
}