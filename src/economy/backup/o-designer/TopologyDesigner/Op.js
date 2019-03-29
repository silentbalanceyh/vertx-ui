import Tool from './Op.Tool';
import Ux from 'ux';

const initDesigner = (reference) => {
    // 工具栏初始化（静态）
    const $toolbars = Tool.initToolbar(reference);
    // 迷你图
    let $minimap = Ux.fromHoc(reference, "minimap");
    $minimap = Ux.clone($minimap);
    // 事件菜单
    let $event = {};
    $event.node = Tool.initEvent(reference, "node");
    $event.edge = Tool.initEvent(reference, "edge");
    $event.group = Tool.initEvent(reference, "group");
    $event.multi = Tool.initEvent(reference, "multi");
    $event.canvas = Tool.initEvent(reference, "canvas");
    reference.setState({$toolbars, $minimap, $event});
};

export default {
    initDesigner
};