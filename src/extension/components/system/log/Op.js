import Ex from 'ex';
import Ux from 'ux';

const yiPage = (reference) => Ex.yiModule(reference, {}, false)
    .then(state => {
        /*
         * 前端静态包含了，所以这里需要整合后端
         */
        const initState = {};
        /*
         * 初始化 $query 设置
         */
        const {hoc} = state;
        let $query = {};
        /*
         * 静态配置
         */
        const config = Ux.fromHoc(reference, "grid");
        if (config.query) {
            Object.assign($query, config.query);
        }
        /*
         * 动态修改 criteria
         */
        if (hoc) {
            if (hoc._query) {
                /*
                 * 重置
                 */
                $query = Ux.qrCombine($query, reference, hoc._query);
            }
            if (hoc._op && hoc._op.key) {
                initState.$opKey = hoc._op.key;
            }
        }
        initState.$query = $query;
        Ux.of(reference).in(initState).ready().done();
        // reference.?etState(initState);
        // state.$ready = true;
    });
export default {
    yiPage
}