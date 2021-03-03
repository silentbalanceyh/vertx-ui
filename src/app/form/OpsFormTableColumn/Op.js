import Ex from "ex";
import Ux from 'ux';
import {Dsl} from 'entity';
import {Of} from 'app';

export default {
    actions: {
        $opSaveTaleColumn: (reference) => (params = {}) => // 加载 loading 效果
            Ex.uiDialog(reference, __dialog => {
                /* 防重复提交 */
                __dialog.onSubmit();
                /* 上层引用 */
                const ref = Ux.onReference(reference, 1);
                const ref2 = Ux.onReference(ref, 1);
                const {$mode} = reference.props;
                if (Ux.Env.FORM_MODE.EDIT === $mode) {
                    /* 提交数据 */
                    return Dsl.of(reference).bind(Of.apiTableColumnEdit).ok((values = {}) => {
                        Ux.sexMessage(ref, "updated");
                        __dialog.onClose();
                        ref2.setState({$refresh: true});
                    }).ko(() => {
                        __dialog.onSubmit(false)
                        Ux.sexMessage(ref, "invalid");
                    }).async(params);
                }
            })
    }
}