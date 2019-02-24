import Tool from './Op.Tool';
import Ux from 'ux';

const initDesigner = (reference) => {
    // 工具栏初始化（静态）
    const $toolbars = Tool.initToolbar(reference);
    // 迷你兔
    const $minimap = Ux.fromHoc(reference, "minimap");
    reference.setState({$toolbars, $minimap});
};

export default {
    initDesigner
};