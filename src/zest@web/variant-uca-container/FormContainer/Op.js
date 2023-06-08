import Yi from './Op.Yi';
import __Zn from '../zero.uca.dependency';
/*
 * FORM：直接从 ref 中的 $form 变量中读取组件
 * JSON：直接抽取 form 配置
 * AJAX：直接从 ajax 配置中读取
 */
const yiInit = (reference) => {
    const {config = {}} = reference.props;
    /*
     * {
     *      "source": "FORM | JSON | REMOTE",
     *      "component": "source = FORM",
     *      "form": "source = JSON",
     *      "ajax": "source = AJAX"
     * }
     */
    const {source = "JSON"} = config;
    if (Yi.hasOwnProperty(source)) {
        const executor = Yi[source];
        if (__Zn.isFunction(executor)) {
            const state = {};
            executor(reference, state).then(state => {
                state.$source = source;
                __Zn.of(reference).in(state).ready().done();
                // reference.?etState(state);
                // state.$ready = true;
            })
        } else {
            __Zn.of(reference).in({
                error: `对不起, source = ${source} 解析出错`
            }).done();
            // reference.?etState({error: `对不起, source = ${source} 解析出错`})
        }
    }
};
export default {
    yiInit
}