import Ux from 'ux';
import yiData from './O.yi.data';
import Cmn from './library';
import {Dsl} from 'entity';

const yiPalette = (reference, state) => {
    /* 执行单处理 */
    const fnNorm = (item) => {
        if ("string" === typeof item) {
            const itemArr = item.split(',');
            const [key, text] = itemArr;
            return {key, text};
        } else return Ux.clone(item);
    }
    const paletteJson = Ux.fromHoc(reference, "palette");
    const palette = [];
    /* 基础控件 */
    if (paletteJson.items) {
        const basicTool = {items: []};
        basicTool.title = paletteJson.title;
        basicTool.key = "pageBasic";
        paletteJson.items.map(fnNorm)
            .forEach(item => basicTool.items.push(item));
        palette.push(basicTool);
    }
    /* 转换 palette 为 Assist */
    state.$palette = palette;
    {
        // 特殊数据源
        const components = palette[0];
        if (components) {
            // ASSIST: 组件类型
            state.$a_model_components = Dsl.getArray(components.items);
        }
    }
    return Ux.promise(state);
}
export default (reference) => {
    const state = {};
    /* _commands 命令工具栏 */
    Cmn.yiCommand(reference, state)
        .then(processed => yiPalette(reference, processed))
        .then(processed => yiData(reference, processed))
        .then(Ux.ready).then(Ux.pipe(reference));
}