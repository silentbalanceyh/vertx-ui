import Ux from 'ux';

const yiWebSource = (reference) => {
    const state = {};
    /*
     * config 中的 table 处理
     */
    const {config = {}} = reference.props;
    const {table = {}, record = {}} = config;
    const $table = Ux.clone(table);
    $table.size = "small";
    $table.pagination = {
        size: "small",
        pageSize: 4
    };
    state.$table = $table;
    /*
     * 记录配置
     */
    state.$record = Ux.clone(record);
    /*
     * 绑定 identifier
     */
    /*
     * 当前 web source 的值
     */
    const ref = Ux.onReference(reference, 1);
    if (ref) {
        const {$inited = {}, $mode = Ux.Env.FORM_MODE.ADD} = ref.props;
        state.$identifier = $inited.identifier;

        if (Ux.Env.FORM_MODE.ADD === $mode || !$inited.identifier) {
            /*
             * 更新流程去触发加载数据的动作
             */
            Ux.of(reference).in(state).ready().done();
            //state.$ready = true;
            //reference.?etState(state);
        } else {
            /*
         * 根据 identifier 读取权限列表
         */
            Ux.ajaxPost('/api/permission/search', {
                criteria: {
                    identifier: $inited.identifier,
                }
            }).then(response => {
                state.$spinning = false;
                /*
                 * 基础数据信息
                 */
                const {list = []} = response;
                state.$source = list;
                /*
                 * 计算 $target
                 */
                const target = Ux.elementUnique(list, 'key', $inited.key);
                if (target) {
                    state.$target = [target.key];   // 注意格式
                }

                Ux.of(reference).in(state).done();
                // reference.?etState(state);
            })
        }
    }
}
const yuWebSource = (reference, virtualRef) => {
    const ref = Ux.onReference(reference, 1);
    if (ref) {
        const current = Ux.formHit(ref, "identifier");
        const {$identifier} = reference.state;
        if (current !== $identifier && current) {
            /*
             * 数据加载中处理
             */
            Ux.of(reference).in({
                $spinning: true,
                $identifier: current
            }).handle(() => {
                // reference.?etState({$spinning: true, $identifier: current});
                /*
                 * 根据 identifier 读取权限列表
                 */
                Ux.ajaxPost('/api/permission/search', {
                    criteria: {
                        identifier: current
                    }
                }).then(response => {

                    const state = {};
                    state.$spinning = false;
                    /*
                     * 基础数据信息
                     */
                    const {list = []} = response;
                    state.$source = list;
                    Ux.of(reference).in(state).done();
                    // reference.?etState(state);
                })
            })
        } else {
            /*
             * 执行重置
             */
            Ux.xtReset(reference, virtualRef, (initialValue) => {
                if (!initialValue) {
                    /*
                     * 无值，直接执行重置
                     * $target, $source
                     */
                    Ux.of(reference).in({
                        $source: [],        // 左边数据源
                        $target: []         // 右边选中
                    }).done()
                    // reference.?etState({
                    //     $source: [],        // 左边数据源
                    //     $target: []         // 右边选中
                    // });
                }
            })
        }
    }

}
const _setForm = (reference, dataRecord = {}, sourcePermission) => {
    const formValues = {};
    formValues.name = dataRecord.name;
    formValues.key = dataRecord.key;        // 选择，所以必须设置主键
    formValues.code = dataRecord.code;
    formValues.comment = dataRecord.comment;

    // sourcePermission 字段处理
    formValues.sourcePermission = sourcePermission;
    const ref = Ux.onReference(reference, 1);
    Ux.formHits(ref, formValues);
}
const rxSrcSelect = (reference) => ($target = []) => {
    // 单独选择处理
    // reference.?etState({$target});
    Ux.of(reference).in({
        $target
    }).handle(() => {
        // Form 设置
        if (0 < $target.length) {
            const {$source = []} = reference.state;
            const sourcePermission = $target[0];
            const dataRecord = Ux.elementUnique($source, 'key', sourcePermission);
            _setForm(reference, dataRecord, sourcePermission);
        }
    })
}
const rxSrcUnSelect = (reference) => (event) => {
    Ux.prevent(event);
    Ux.of(reference).in({
        $target: []
    }).handle(() => {
        // reference.?etState({$target: []});
        // Form 设置
        const ref = Ux.onReference(reference, 1);
        let key;
        if (ref) {
            const {$mode = Ux.Env.FORM_MODE.ADD, $inited = {}} = ref.props;
            if (Ux.Env.FORM_MODE.ADD === $mode || !$inited.key) {
                key = Ux.randomUUID();
            } else {
                key = $inited.key;
            }
        }
        _setForm(reference, {key});
    });
}
export default {
    yiWebSource,
    yuWebSource,
    rxSrcSelect,
    rxSrcUnSelect,
}