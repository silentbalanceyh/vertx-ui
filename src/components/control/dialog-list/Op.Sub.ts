import Ux from 'ux';

const $opSubSave = (reference: any) => Ux.ai2Event(reference, (values) => {

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
const $opSubAdd = (reference: any) => Ux.ai2Event(reference, (values) => {

});
export default {
    $opSubSave,
    $opSubAdd
}