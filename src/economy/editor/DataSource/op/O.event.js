import Ux from 'ux';

const onSubmit = (reference, params = {}) => {
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
    },
    actions: {
        $opSaveAssist: (reference) => (params) => {

        },
        /*
         * assist -> tabular 节点
         */
        $opSaveTabular: (reference) => (params) =>
            onSubmit(reference, params),
        $opSaveCategory: (reference) => (params) =>
            onSubmit(reference, params)
    }
}