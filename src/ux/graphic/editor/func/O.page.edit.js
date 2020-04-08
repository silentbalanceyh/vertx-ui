import Abs from '../../../abyss';
import Eng from '../../../engine';

import Cfg from './O.config';
import g6Event from '../event/O.event';
import I from './I.common';

const g6PageConfig = (reference) => {

    /* 读取 _graphic */
    const graphic = I.g6Start(reference);

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
        $graphic.source = I.g6Source(reference, graphic);
    }

    /* 图形配置 */
    if (graphic.css) {
        /*
         * 图形配置处理
         */
        const {canvasHeight, ...rest} = graphic.css;
        $graphic.graphConfig = Cfg.g6ConfigEditor(reference, canvasHeight);
        $graphic.graph = rest;
        $graphic.nodeConfig = Cfg.g6ConfigNode(graphic.node);
    }
    return $graphic;
};

const g6PageInit = (reference, onInit) => {
    const state = {};
    /* 图配置初始化 */
    state.$graphic = g6PageConfig(reference);

    /* 窗口专用函数 */
    state.$submitting = false;
    state.$visible = false;
    state.$inited = undefined;

    onInit(reference, state).then(processed => {
        reference.setState(processed);
        /* 维持一个实例，只在 DidMount 中执行，并且等最终成型后执行 */
        processed.$event = new g6Event(reference);
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