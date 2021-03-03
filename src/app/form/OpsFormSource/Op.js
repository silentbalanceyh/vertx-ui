import Ex from "ex";
import Ux from 'ux';
import {Dsl} from 'entity';
import {Of} from 'app';

export default {
    actions: {
        $opSaveSource: (reference) => (params = {}) => // 加载 loading 效果
            Ex.uiDialog(reference, __dialog => {
                /* 防重复提交 */
                __dialog.onSubmit();
                /* 上层引用 */
                const ref = Ux.onReference(reference, 1);
                const {$mode} = reference.props;
                if (Ux.Env.FORM_MODE.EDIT === $mode) {
                    /* 提交数据 */
                    return Dsl.of(reference).bind(Of.apiSourceEdit).ok((values = {}) => {
                        Ux.sexMessage(ref, "updated");
                        __dialog.onClose();
                        const {rxRefresh} = ref.props;
                        if (Ux.isFunction(rxRefresh)) {
                            // 使用入参更新
                            rxRefresh(params);
                        }
                    }).ko(() => {
                        __dialog.onSubmit(false)
                        Ux.sexMessage(ref, "invalid");
                    }).async(params);
                } else {
                    /* 提交数据 */
                    return Dsl.of(reference).bind(Of.apiSourceAdd).ok((values = {}) => {
                        Ux.sexMessage(ref, "created");
                        __dialog.onClose({$refresh: Ux.randomString(8)});
                    }).ko(() => {
                        __dialog.onSubmit(false)
                        Ux.sexMessage(ref, "invalid");
                    }).async(params);
                }
            }),
        $opCheckSource: (reference) => (params = {}) =>
            // 加载 loading 效果
            Ex.uiDialog(reference, __dialog => {
                /* 防重复提交 */
                __dialog.onSubmit();
                /* 提交数据 */
                return Dsl.of(reference).bind(Of.apiSourceCheck).ok((values = {}) => {
                    const {code, info} = values;
                    if (0 < code) {
                        Ux.messageSuccess(info);
                    } else {
                        Ux.messageFailure(info);
                    }
                    __dialog.onSubmit(false)
                }).async(params);
            })
    }
}