import {Dsl} from 'entity';
import uiTotal from './Web.Total';
import __Zn from '../zero.uca.dependency';
import {Button} from 'antd';

const renderColumn = (reference) => {
    return {
        dataIndex: "key",
        className: "op-cell",
        render: (text, record, index) => {
            return (
                <Button.Group>
                    <Button icon={__Zn.v4Icon("edit")} size={"small"}
                            onClick={onEdit(reference, record)}/>
                    {(() => {
                        if ("tabular" === text || "category" === text) {
                            return false;
                        } else {
                            return (
                                <Button icon={__Zn.v4Icon("delete")} danger size={"small"}
                                        onClick={onRemove(reference, record)}/>
                            );
                        }
                    })()}
                </Button.Group>
            );
        }
    };
}
const yiPage = (reference) => {
    const state = {};
    const {$inited = {}} = reference.props;
    /* 是否包含了初始化数据 */
    if (__Zn.isEmpty($inited)) {
        state.$data = [];
    } else {
        const normalized = [];
        Object.keys($inited).forEach(key => {
            const hitted = $inited[key];
            if (hitted && hitted.uri) {
                /* 读取 assert 数据 */
                const assist = {};
                assist.name = key;
                assist.key = key;
                /* 三种分离 */
                assist.method = hitted.method ? hitted.method : "GET";
                assist.uri = hitted.uri;
                /* magic 参数节点 */
                if (hitted.magic) {
                    assist.magic = hitted.magic;
                }
                normalized.push(assist);
            }
        })
        state.$data = normalized;
    }
    /* 选择类型 */
    const selection = __Zn.fromHoc(reference, "selection");
    if (selection && __Zn.isArray(selection.options)) {
        const $selection = __Zn.clone(selection);
        $selection.items = [];
        selection.options.forEach(option => {
            const item = {};
            if ("string" === typeof option) {
                const optionArr = option.split(',');
                const [key, text] = optionArr;
                item.value = key;
                item.label = text;
            } else {
                Object.assign(item, option);
            }
            $selection.items.push(item);
        });
        state.$selection = $selection;
    }
    /* 已选中的表格配置 */
    const table = __Zn.fromHoc(reference, "table");
    const $table = __Zn.clone(table);
    $table.columns = [renderColumn(reference)].concat(__Zn.configColumn(reference, $table.columns));
    $table.pagination.showTotal = uiTotal(reference)
    state.$table = $table;
    /* 处理 raft 处理 */
    __Zn.of(reference).in(state).ready().done();
    // state.$ready = true;
    // reference.?etState(state);
}
const onRemove = (reference, record) => (event) => {
    __Zn.prevent(event);
    let {$data = []} = reference.state;
    $data = __Zn.clone($data);
    $data = $data.filter(item => record.key !== item.key);
    __Zn.of(reference).in({$data}).handle(() => {

        __Zn.fn(reference).rxSubmit(record.key);
    })
    // reference.?etState({$data});
    // __Zn.fn(reference).rxSubmit(record.key);
}
const onEdit = (reference, record) => (event) => {
    __Zn.promise(event);
    const state = {};
    if ("tabular" === record.name) {
        state.$checked = "TABULAR";
        state.$assist = undefined;
    } else if ("category" === record.name) {
        state.$checked = "CATEGORY";
        state.$assist = undefined;
    } else {
        state.$checked = "ASSIST";
        // Fix：解决重复选择记录界面不刷新的问题
        const $record = __Zn.clone(record);
        if (!$record.magic) {
            $record.magic = {};
        }
        if ($record.key) delete $record.key;
        state.$assist = $record;
    }
    __Zn.of(reference).in(state).done();
    // reference.?etState(state);
}
const _onSubmit = (reference, params = {}) => {
    const $params = __Zn.clone(params);
    const {types = [], ...rest} = $params;
    /* 关闭防重复提交 */
    __Zn.of(reference).load().handle(() => {

        if (0 < types.length) {
            rest.magic = {$body: types};
            return __Zn.fn(reference).rxSubmit(rest);
        } else {
            return __Zn.fn(reference).rxSubmit({name: params.name});
        }
    })
    // reference.?etState({$submitting: false, $loading: false});
    // if (0 < types.length) {
    //     rest.magic = {$body: types};
    //     return __Zn.fn(reference).rxSubmit(rest);
    // } else {
    //     return __Zn.fn(reference).rxSubmit({name: params.name});
    // }
}

export default {
    yiPage,
    onCheck: (reference) => (checked) => {
        const $checked = __Zn.ambEvent(checked);
        __Zn.of(reference).in({$checked}).done();
        // reference.?etState({$checked});
    },
    toInit: ($data = [], key) => {
        const dict = __Zn.elementUnique($data, "name", key);
        const $inited = {};
        if (dict) {
            const {magic = {}, ...rest} = dict;
            Object.assign($inited, rest);
            $inited.types = magic.$body ? magic.$body : [];
        }
        return $inited;
    },
    onRemove,
    onSubmit: (reference) => (params) => {
        const comment = __Zn.fromHoc(reference, "comment");
        __Zn.messageSuccess(comment.submit);
        {
            const {$data = []} = reference.state;
            const dataArray = Dsl.getArray($data.reverse());
            const $params = __Zn.clone(params);
            $params.key = $params.name;
            dataArray.saveElement($params);
            /* 状态更新 */
            __Zn.of(reference).in({
                $data: dataArray.to().reverse(),
                $assist: undefined      // 清空 AssistForm 表单
            }).handle(() => {

                /* 后提交 */
                __Zn.fn(reference).rxSubmit(params);
            })
            // reference.?etState({
            //     $data: dataArray.to().reverse(),
            //     $assist: undefined      // 清空 AssistForm 表单
            // });
            // __Zn.fn(reference).rxSubmit(params);
        }
    },
    onEdit,
    actions: {
        $opSaveAssist: (reference) => (params) => {
            /* 关闭防重复提交 */
            // reference.?etState({
            //     $submitting: false, $loading: false,
            // });
            return __Zn.of(reference).load().future(() => {

                /* 重置表单 */
                const {$inited = {}} = reference.props;
                const form = __Zn.v4FormRef(reference);
                if (form) {
                    // form.setFieldsInitialValue
                    form.setFieldsValue($inited);
                    __Zn.formReset(reference);
                }

                return __Zn.fn(reference).rxSubmit(params);
            })

            // const {form, $inited = {}} = reference.props;
            // if (form) {
            //     form.setFieldsInitialValue($inited);
            //     __Zn.formReset(reference);
            // }
            /* 重置表单 */
            // return __Zn.fn(reference).rxSubmit(params);
        },
        /*
         * assist -> tabular 节点
         */
        $opSaveTabular: (reference) => (params) =>
            _onSubmit(reference, params),
        $opSaveCategory: (reference) => (params) =>
            _onSubmit(reference, params)
    }
}