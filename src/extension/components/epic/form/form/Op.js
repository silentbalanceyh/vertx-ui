import Ex from 'ex';
import Ux from 'ux';
import {Dsl} from 'entity';

export default {
    actions: {
        $opSubmit: (reference) => (params) => {
            {
                /* 表单数据处理 */
                params.code = `form.${params.identifier}.${params.code}`;
            }
            Ex.uiDialog(reference, __dialog => {
                /* 提交 */
                __dialog.onSubmit({$loading: true});
                const ref = Ux.onReference(reference, 2);
                /* Callback */
                const fnCallback = (data) => {
                    /* 更新数据 */
                    let {$data = []} = ref.state;
                    const dataArray = Dsl.getArray($data);
                    dataArray.saveElement(data);
                    $data = dataArray.to();
                    /* 提示消息 */
                    const toolbar = Ux.fromHoc(ref, "toolbar");
                    const {callback = {}} = toolbar;
                    let message = params.key ? callback.saved : callback.added;
                    Ux.messageSuccess(message);
                    /* 关闭窗口 */
                    Ux.toLoading(() => {
                        /* 消息提示 */
                        __dialog.onClose({$loading: false, $data});
                    }, 20);
                }
                /* 判断是添加还是更新 */
                if (params.key) {
                    /* 更新 */
                    Ux.ajaxPut("/api/ui-form/:key", params).then(fnCallback)
                } else {
                    /* 添加 */
                    Ux.ajaxPost("/api/ui-form", params).then(fnCallback)
                }
            })
        }
    }
}