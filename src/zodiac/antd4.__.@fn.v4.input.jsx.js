import __Zn from './zero.module.dependency';
import v4InputDepend from './antd4.__.@fn.v4.input.jsx.segment';

const cssRender = () => __Zn.Env.TYPE_JSX_RENDERS;

const __v4Renders = (optionJsx = {}, renders = {}, cell = {}) => {
    const webComponents = cssRender();
    // 追加一个条件，只针对 DialogEditor 之下以下流程
    if (webComponents.includes(cell.render)) {
        if (renders.hasOwnProperty(cell.field)) {
            // renders 注入到 optionJsx 中，底层组件会自动读取
            const $renders = renders[cell.field];
            if (__Zn.isNotEmpty($renders)) {
                optionJsx.$renders = $renders;
            }
        }
    }
}
export default (values = {}, configuration = {}) => {
    const {
        reference,
        renders = {},
        cell,
    } = configuration;
    // 不可能 undefined
    const optionJsx = v4InputDepend(values, configuration);
    /* 子表单继承 renders（DialogEditor可能要用） */
    __v4Renders(optionJsx, renders, cell);
    /* reference 绑定 */
    optionJsx.reference = reference;
    return optionJsx;
}