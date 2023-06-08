import {Dsl} from 'entity';
import __Zn from '../zero.uca.dependency';

const onRowRemove = (reference, key) => (event) => {
    __Zn.prevent(event);
    let {data = []} = reference.state;
    data = __Zn.clone(data);
    data = data.filter(item => key !== item.key);

    __Zn.of(reference).in({data}).handle(() => {

        /*
         * 直接提交，调 onSubmit
         */
        const {$changeCascade = true} = reference.props;
        if ($changeCascade) {
            __Zn.fn(reference).onChange(data);
        }
    })
    // reference.?etState({data});
    /*
     * 直接提交，调 onSubmit
     */
    // const {$changeCascade = true} = reference.props;
    // if ($changeCascade) {
    //     __Zn.fn(reference).onChange(data);
    // }
}
const renderColumn = (reference, op = {}) => {
    return {
        dataIndex: "key",
        render: (text) => (
            // eslint-disable-next-line
            <a href={""} onClick={onRowRemove(reference, text)}>
                {__Zn.v4Icon("delete")}
                &nbsp;&nbsp;
                {op.remove}
            </a>
        )
    };
}
export default {
    yiPage: (reference) => {
        const state = {};
        /* _op */
        const $op = __Zn.fromHoc(reference, "op");
        /* 表格配置 */
        const table = __Zn.fromHoc(reference, "table");
        const $table = __Zn.clone(table);
        $table.columns = [renderColumn(reference, $op)]
            .concat(__Zn.configColumn(reference, $table.columns));
        state.$table = $table;
        /* 内置数据基础 */
        const {data = []} = reference.props;
        const $data = __Zn.clone(data);
        $data.filter(item => !item.key)
            .forEach(item => item.key = __Zn.randomUUID())
        state.data = $data;
        /* onChange 专用 */
        __Zn.of(reference).in(state).ready().done();
        // reference.?etState(state);
        // state.$ready = true;
    },
    onRowRemove,
    onChange: (reference) => (params = {}) => {
        if (params.name) {
            const $params = __Zn.clone(params);
            const {data = []} = reference.state;
            const dataArray = Dsl.getArray(data);
            dataArray.saveElement($params, 'name');
            const $data = dataArray.to();

            __Zn.of(reference).in({
                data: $data
            }).handle(() => {

                /*
                 * 直接提交，调 onSubmit
                 */
                const {$changeCascade = true} = reference.props;
                if ($changeCascade) {
                    __Zn.fn(reference).onChange($data);
                }
            })
            // reference.?etState(state);
            // state.$ready = true;
            // reference.?etState({data: $data});
            // /*
            //  * 直接提交，调 onSubmit
            //  */
            // const {$changeCascade = true} = reference.props;
            // if ($changeCascade) {
            //     __Zn.fn(reference).onChange($data);
            // }
        }
    },
    onSubmit: (reference) => (event = {}) => {
        __Zn.prevent(event);
        const {data = []} = reference.state;
        /*
         * 生成 magic 格式
         */
        __Zn.fn(reference).onChange(data);
    },
    actions: {
        $opSaveParam: (reference) => (params = {}) => {
            /* 重设表单 */
            __Zn.formReset(reference);
            /* 父引用更新 */
            __Zn.of(reference).load().handle(() => {

                /* 调用父类 onChange */
                __Zn.fn(reference).onChange(params);
            })
            // reference.?etState({
            //     $loading: false,        // 加载
            //     $submitting: false      // 提交
            // });
            // /* 调用父类 onChange */
            // __Zn.fn(reference).onChange(params);
        }
    }
}