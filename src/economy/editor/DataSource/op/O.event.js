import Ux from 'ux';
import {Dsl} from 'entity';

const _onSubmit = (reference, params = {}) => {
    const $params = Ux.clone(params);
    const {types = [], ...rest} = $params;
    if (rest.hasOwnProperty('typesJson')) {
        delete rest.typesJson;
    }
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
    onSubmit: (reference) => (params) => {
        const comment = Ux.fromHoc(reference, "comment");
        Ux.fn(reference).rxSubmit(params);
        Ux.messageSuccess(comment.submit);
        {
            const {$data = []} = reference.state;
            const dataArray = Dsl.getArray($data);
            const $params = Ux.clone(params);
            $params.key = $params.name;
            dataArray.saveElement($params);
            reference.setState({$data: dataArray.to()})
        }
    },
    onEdit: (reference, record) => (event) => {
        Ux.promise(event);
        const state = {};
        if ("tabular" === record.key) {
            state.$checked = "TABULAR";
            state.$assist = undefined;
        } else if ("category" === record.key) {
            state.$checked = "CATEGORY";
            state.$assist = undefined;
        } else {
            state.$checked = "ASSIST";
            // Fix：解决重复选择记录界面不刷新的问题
            const $record = Ux.clone(record);
            if (!$record.magic) {
                $record.magic = {};
            }
            state.$assist = $record;
        }
        reference.setState(state);
    },
    onRemove: (reference, record) => (event) => {

    },
    actions: {
        $opSaveAssist: (reference) => (params) => {

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