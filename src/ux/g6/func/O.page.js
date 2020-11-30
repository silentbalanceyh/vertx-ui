import Abs from '../../abyss';
import Eng from '../../engine';
import {GEvent} from '../event';
/*
 * 图形配置，输入，重新设计相关数据结构
 */
const g6PageConfig = (reference) => {

    /* 读取 _graphic */
    const graphic = // I.g6Start(reference);
        console.log(graphic);

    /* dialog 关系窗口 */
    const $graphic = {};
    if (graphic.window) {
        $graphic.window = Eng.configDialog(reference, graphic.window);
    }

    /* 右键菜单 */
    if (graphic.context) {
        $graphic.context = graphic.context;
    }

    /* command菜单专用栏 */
    if (graphic.command) {
        $graphic.command = graphic.command;
    }
    /*
     * 调色盘
     */
    if (graphic.source) {
        // $graphic.source = // I.g6Source(reference, graphic);
    }

    /* 图形配置 */
    if (graphic.css) {
        /*
         * 图形配置处理
         */
        const {canvasHeight, ...rest} = graphic.css;
        $graphic.graphConfig = // Cfg.g6ConfigEditor(reference, canvasHeight);
            $graphic.graph = rest;
        // $graphic.nodeConfig // Cfg.g6ConfigNode(graphic.node);
    }
    return $graphic;
};
const g6PageInit = (reference, onInit) => {
    const state = {};
    /*
     * 通用树形：
     * - $visible，是否打开弹窗，弹窗状态。
     * - $submitting，防重复提交（正在提交）
     * - $inited，如果打开窗口是表单则表示表单的初始化数据信息
     */
    state.$submitting = false;
    state.$visible = false;
    state.$inited = undefined;
    /*
     * 构造 GEvent
     */
    state.$gEvent = GEvent.create(reference);
    onInit(reference, state).then(processed => {
        // 准备完成
        processed.$ready = true;
        reference.setState(processed);
    })
};
const g6PageUp = (reference, virtualRef, onInit) => {
    const {$current} = reference.props;
    const $previous = virtualRef.props.$current;
    if ($current && $previous) {
        if ($current.identifier !== $previous.identifier) {
            reference.setState({$ready: false});
            const startState = Abs.clone(reference.state);
            onInit(reference, startState).then(state => {
                state.$ready = true;
                reference.setState(state);
            })
        }
    }
};
/*
 * 状态配置专用
 * $dialog: 关系管理窗口配置信息
 *
 */
export default {
    g6PageInit,
    g6PageUp
}