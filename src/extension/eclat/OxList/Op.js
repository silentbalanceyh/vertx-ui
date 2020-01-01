import Ux from 'ux';
import Ex from 'ex';
import UI from 'oi';

const yiModule = (reference) => {
    const {$form, $controls = {}} = reference.props;
    if ($form) {
        const {FormAdd, FormEdit, FormFilter} = $form;
        /*
         * 提取 三个核心的 control 数据
         */
        return Ux.promise({
            FormAdd: $controls[FormAdd],
            FormEdit: $controls[FormEdit],
            FormFilter: $controls[FormFilter]
        }).then(response => {
            const $form = {};
            Object.keys(response).forEach(field => $form[field] =
                (props) => Ex.xuiDecorator(response[field], UI, props));
            const state = {};
            state.$ready = true;
            state.$form = $form;
            reference.setState(state);
        });
    }
};
const yoQuery = (reference, $config = {}) => {
    /*
     * 特殊的 $query 配置
     */
    const {$query, ...rest} = $config;
    const config = Ux.clone(rest);
    if ($query && config.query) {
        /*
         * 合并基础规则
         */
        if (!config.query.criteria) {
            config.query.criteria = {};
        }
        Object.assign(config.query.criteria, $query);
    }
    /*
     * 读取 criteria 引用
     */
    const criteriaRef = config.query.criteria;
    let query = Ux.toQuery("query");
    if (query && "string" === typeof query) {
        try {
            query = Ux.decryptBase64(query);
            query = JSON.parse(query);
            if (Ux.isEmpty(criteriaRef)) {
                Object.assign(criteriaRef, query);
            } else {
                const merged = {};
                merged["$0"] = query;
                merged[""] = true;
                merged["$1"] = Ux.clone(criteriaRef);
                config.query.criteria = merged;
            }
        } catch (e) {
            console.error("解析 query 参数出错！", e);
        }
    } else {
        Ux.dgDebug({query}, "跳过外置 query 参数：", "#388E8E");
    }
    return config;
};
export default {
    yiModule,
    yoQuery
}