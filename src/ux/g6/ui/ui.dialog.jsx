import {Modal} from 'antd';
import React from 'react';
import Abs from '../../abyss';
import Cv from '../../constant';

export default (reference, config = {}) => {
    const {
        $visible = false, $ready = false,
        $inited = {},
        $openConfig, $openId, $openComponent,
        $gEvent,
    } = reference.state;
    /*
     * 提取配置信息
     */
    const {supplier, component: Component} = config;

    const inherit = Abs.isFunction(supplier) ? supplier(reference) : {};
    inherit.$mode = Cv.FORM_MODE.ADD;
    inherit.$inited = $inited;
    inherit.$openId = $openId;
    inherit.$gEvent = $gEvent;
    /*
     * 提取 Ui
     */
    let UI;
    if ($openComponent) {
        UI = $openComponent;
    } else {
        UI = Component;
    }
    return ($ready && $openConfig && UI) ? (
        <Modal {...$openConfig} visible={$visible} onCancel={event => {
            Abs.prevent(event);
            if ($openId) {
                // 关闭窗口
                $gEvent.winClose();

                // 调用上册方法
                const graph = $gEvent.g6Graph();
                const cell = graph.getCellById($openId);

                /**
                 * 此处调用上层方法，主要把行为变成抽象调用，不执行实际内容
                 * 而是改成调用上层的 onWindowClose 方法来执行实现，而该
                 * 方法内部仅做窗口关闭的事。
                 */
                $gEvent.onWindowClose(cell);
            }
        }}>
            <UI {...inherit}/>
        </Modal>
    ) : false

}