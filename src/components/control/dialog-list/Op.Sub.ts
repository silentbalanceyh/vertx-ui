import Ux from 'ux';

const $opSubSave = (reference: any) => (values) => {
    // 更新窗口回调
    console.info(values, reference.props);
    // 关闭窗口
    Ux.closeWindow(reference);
    // 更新数据
    Ux.rdxListItem(reference, values);
};
const $opSubAdd = (reference: any) => (values) => {
    // 添加窗口回调
    console.info(values, reference.props);
    // 关闭窗口
    Ux.closeWindow(reference);
    // 更新数据
    Ux.rdxListItem(reference, values);
};
export default {
    $opSubSave,
    $opSubAdd
}