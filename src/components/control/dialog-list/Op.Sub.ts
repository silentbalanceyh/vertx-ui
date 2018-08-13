import Ux from 'ux';

const $opSubSave = (reference: any) => (values) => {
    // 更新窗口回调
    console.info(values, reference.props);
    // 关闭窗口
    Ux.closeWindow(reference);
    // 更新数据
    values.key = Ux.randomUUID();
    reference.props.fnListItem(Ux.randomUUID(), values);
};
const $opSubAdd = (reference: any) => (values) => {
    // 添加窗口回调
    console.info(values, reference.props);
    // 关闭窗口
    Ux.closeWindow(reference);
    // 更新数据
    reference.props.fnListItem(values.key, values);
};
const opSubDeletePost = (reference: any) => (id: any) => {
    // 列表删除回调
    console.info(id, reference)
};
export default {
    $opSubSave,
    $opSubAdd,
    opSubDeletePost
}