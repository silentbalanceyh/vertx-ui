import Event from './Op.Change';
import Ux from "ux";

const DFT_CONFIG = {
    undoRedo: true, // 撤销/继续功能
    removeStyle: true, // 清除功能
    pasteNoStyle: true, // 拷贝功能
    blockStyle: true, // 段落功能
    alignment: true, // 居中对齐功能
    inlineStyle: true, // 设置内联处理
    color: false, // 彩色文字
    image: false, // 图片上传——依赖上传
    video: false, // 视频上传——依赖上传
    audio: false, // 音频上传——依赖上传
    urls: true, // 提供超链接功能
    autoSave: false, // 自动保存
    fullScreen: false, // 是否全屏编辑
    convertFormat: "markdown", // 默认格式：html, markdown, raw三种，鉴于Markdown比较流行
};
const initConfig = (reference: any) => {
    const {config = {}} = reference.props;
    const attrs = Object.assign({}, DFT_CONFIG, config);
    attrs.cbReceiver = Event.on2Change(reference);
    return attrs;
};
const initValue = (props: any) => {
    // 直接从value中提取
    if (props.value) {
        return {markdown: props.value};
    } else {
        return {markdown: ""};
    }
};
const updateValue = (reference, prevState) => {
    const updated = reference.props.value;
    const previous = prevState.markdown;
    if (updated !== previous) {
        // 先更新状态
        reference.setState({markdown: updated});
        // Change触发
        Ux.xtChange(reference, updated, true);
    }
};
export default {
    initConfig,
    initValue,
    updateValue
}