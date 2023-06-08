import {Modal} from "antd";
import React from "react";
import Ux from 'ux';
import Ex from 'ex';
import ExView from '../ExView/UI';
import Op from './Op';

export default (reference) => {
    const {
        $dialog = {},
        $inited = {},
        $mode = Ux.Env.FORM_MODE.EDIT,
    } = reference.state;
    const configDialog = {};
    if ($mode === Ux.Env.FORM_MODE.ADD) {
        Object.assign(configDialog, $dialog.add);
    } else {
        Object.assign(configDialog, $dialog.edit);
    }
    /*
     * 字段集以及相关配置
     */
    const {config = {}, $options = {}} = reference.props;
    const {$columns} = config;
    const $parameters = {};
    $parameters.uri = $options[Ex.Opt.AJAX_SEARCH_URI];
    $parameters.method = "POST";    // 固定值

    const child = Ex.yoDialog(reference, configDialog);
    child.rxClose = (view = {}) => {
        const state = {};
        state.$loading = true;
        Op.rxRefresh(reference, state).then(stateUp => {
            const {$myView} = reference.props;
            if ($myView.name === view.name) {
                // 更新当前视图
                Ux.of(reference).in(stateUp).load().spun().hide().future().then(() => {
                    // 处理 view
                    const {rxMyViewAt} = reference.props;
                    if (Ux.isFunction(rxMyViewAt)) {
                        rxMyViewAt(view);
                    }
                });
            } else {
                // 更新非当前视图
                Ux.of(reference).in(stateUp).load().spun().hide().done();
            }
        });
        /*
         * 关闭专用函数
         */
        // console.log(event, reference.props);
        // Ux.of(reference).in(state).load().hide().done();
    }
    child.rxSubmitting = Ux.rxSubmitting(reference);
    return (
        <Modal {...configDialog}>
            <ExView {...child}
                    $inited={$inited}
                    config={{
                        // 所有列的基础信息（Projection够了）
                        field: $columns,
                    }}
                    $parameters={$parameters}/>
        </Modal>
    );
}