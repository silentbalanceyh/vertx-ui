import Ux from 'ux';
import {Dsl} from 'entity';

const _onSubmit = (reference, params = {}) => {
    const $params = Ux.clone(params);
    const {types = [], ...rest} = $params;
    /* 关闭防重复提交 */
    reference.setState({$submitting: false, $loading: false});
    if (0 < types.length) {
        rest.magic = {$body: types};
        return Ux.fn(reference).rxSubmit(rest);
    } else {
        return Ux.fn(reference).rxSubmit({name: params.name});
    }
}

export default {
    onCheck: (reference) => (checked) => {
        const $checked = Ux.ambEvent(checked);
        reference.setState({$checked});
    },
    toInit: ($data = [], key) => {
        const dict = Ux.elementUnique($data, "name", key);
        const $inited = {};
        if (dict) {
            const {magic = {}, ...rest} = dict;
            Object.assign($inited, rest);
            $inited.types = magic.$body ? magic.$body : [];
        }
        return $inited;
    },
    onRemove: (reference, record) => (event) => {
        Ux.prevent(event);
        let {$data = []} = reference.state;
        $data = Ux.clone($data);
        $data = $data.filter(item => record.key !== item.key);
        reference.setState({$data});
        Ux.fn(reference).rxSubmit(record.key);
    },
    onSubmit: (reference) => (params) => {
        const comment = Ux.fromHoc(reference, "comment");
        Ux.messageSuccess(comment.submit);
        {
            const {$data = []} = reference.state;
            const dataArray = Dsl.getArray($data.reverse());
            const $params = Ux.clone(params);
            $params.key = $params.name;
            dataArray.saveElement($params);
            /* 状态更新 */
            reference.setState({
                $data: dataArray.to().reverse(),
                $assist: undefined      // 清空 AssistForm 表单
            });
            /* 后提交 */
            Ux.fn(reference).rxSubmit(params);
        }
    },
    onEdit: (reference, record) => (event) => {
        Ux.promise(event);
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
            const $record = Ux.clone(record);
            if (!$record.magic) {
                $record.magic = {};
            }
            if ($record.key) delete $record.key;
            state.$assist = $record;
        }
        reference.setState(state);
    },
    actions: {
        $opSaveAssist: (reference) => (params) => {
            /* 关闭防重复提交 */
            reference.setState({
                $submitting: false, $loading: false,
            });
            /* 重置表单 */
            const {form, $inited = {}} = reference.props;
            if (form) {
                form.setFieldsInitialValue($inited);
                Ux.formReset(reference);
            }
            /* 重置表单 */
            return Ux.fn(reference).rxSubmit(params);
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