import Ux from 'ux';

const $opSubSave = (reference: any) => Ux.ai2Event(reference,
    (values) => {
        Ux.closeWindow(reference);
    });
/**
 * (values) => {
    // 更新窗口回调
    console.info(values, reference.props);
    // 关闭窗口
    Ux.closeWindow(reference);
    // 更新数据
    Ux.rdxListItem(reference, values);
}
 * @param reference
 */
const $opSubAdd = (reference: any) => Ux.ai2Event(reference,
    (values) => {
        Ux.closeWindow(reference);
    });
export default {
    $opSubSave,
    $opSubAdd
}