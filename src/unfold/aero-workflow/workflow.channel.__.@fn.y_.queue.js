import Ux from "ux";
import __Zn from './zero.workflow.dependency';
import __CFG from './workflow.__.fn.config.norm';

export default (reference) => ({
    yiQueue: () => __Zn.yiAssist(reference).then(state => {

        /*
         * 外层传入 $query，保留分页、排序、列参数
         * $query 是查询专用的，在更新时更新查询条件
         * $queryDefault 是默认查询条件，所有查询操作都基于该查询条件处理
         */
        const grid = Ux.fromHoc(reference, "grid");
        const options = grid.options ? grid.options : {};
        state.options = Ux.clone(options);
        /*
         * qbe new version
         * 1. ajax.position -> 计算position
         * 2. position 新增格式：{}
         * -- qbeQr:       查询参数
         * -- qbe:         选中参数
         * -- qbeDefault:  默认选中
         */
        const qbe = options[__Zn.Opt.PARAMETER];
        const qbeV = Ux.parseParameter(qbe, reference);
        if (Ux.isNotEmpty(qbeV)) {
            state.$queryDefault = Ux.clone(grid.query);
            state.$query = Ux.clone(grid.query);

            state.$qbeQr = qbeV;
            // reference.?etState(state);

            Ux.of(reference).in(state).ready().done();
            // reference.?etState(state);
            // state.$ready = true;
        } else {
            throw new Error("工作流的列表 code 丢失")
        }
    }),
    // 新方法 yoWorkflow
    yoQueue: () => {
        const inherits = __Zn.yoAmbient(reference);
        const grid = __Zn.yoGrid(reference);
        // config -> grid ( FastList )
        inherits.config = grid;
        /*
         * grid -> parameter / record
         * workflow combine
         * 1) 将 parameter 和 $workflow 合并（parameter有更高优先级）
         * 2) 将 record 追加到 $workflow 中
         * 计算 synonym 到 $synonym
         */
        const {parameter = {}, record = {}, options = {}} = grid;
        let {$workflow = {}} = reference.props;
        $workflow = Ux.clone($workflow);
        Object.assign($workflow, parameter);
        $workflow.record = record;
        inherits.$workflow = $workflow;

        const synonym = __CFG.configUi($workflow, "synonym");
        if (Ux.isNotEmpty(synonym)) {
            inherits.$synonym = synonym;
        }

        let {
            $query = {},
            $refresh,
        } = reference.state;
        inherits.$refresh = $refresh;
        inherits.$query = $query;

        inherits.rxSearch = (query) => {
            const {$qbe} = reference.state;
            if ($qbe) {
                return Ux.ajaxPost(`${options[__Zn.Opt.AJAX_SEARCH_URI]}?QBE=:qbe`, {
                    qbe: $qbe,
                    $body: query
                });
            } else {
                return Ux.promise({list: [], count: 0})
            }
        };
        return inherits;
    },
})