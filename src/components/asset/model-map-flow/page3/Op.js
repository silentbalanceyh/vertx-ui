import Ux from "ux";
import {Of} from "app";
import {Dsl} from 'entity';
import Connect from "../Op.connect";
import Populate from "../Populate.Data";

const beforeVerify = (reference, params = {}) => {
    const fnFailure = () => {
        const ref = Ux.onReference(reference, 1);
        Ux.sexMessage(ref, "relation");
        Ux.formRedo(reference);
    }
    if (params['modelAction']) {
        const {from, to} = params['modelAction'];
        if (from && to) {
            return true;
        } else {
            fnFailure();
        }
    } else {
        fnFailure();
    }
}

const beforeRequest = (reference, params = {}) => {
    const {$inited = {}} = reference.props;
    const request = {};
    if (!$inited.actions) {
        request.actions = [];
    } else {
        // 维持旧的 relations
        request.actions = Ux.clone($inited.actions);
    }
    const $actions = Dsl.getArray(request.actions);
    // 关系数据
    const action = {};
    action.key = $inited['actModelName'];
    action.tableName = $inited['actTableName'];
    action.modelName = $inited['actModelName'];
    action.columnsRel = $inited['columnsAct'];
    action.modelId = $inited['actModelId'];
    action.modelAct = $inited['actModelAct'];
    action.mode = params['actMode'];
    action.createdAt = Ux.valueNow();
    action.reference = params.modelAction;
    $actions.saveElement(action, 'actModelName');
    request.actions = $actions.to();
    {
        // 清除关系部分的数据
        request.action = {};
        request.actTableName = null;
        request.actModelName = null;
        request.actMode = null;
        request.actModelId = null;
        request.actModelAct = null;
        request.modelAction = null;
    }
    return request;
}

export default {
    ...Connect,

    rxStep2: (reference) => (event) => {
        Ux.prevent(event);
        const {$keySet} = reference.state;
        if ($keySet) {
            const columnsAct = Array.from($keySet);
            if (0 < columnsAct.length) {
                Ux.fn(reference).rxNext({action: {columnsAct}});
            } else {
                Ux.sexMessage(reference, "empty")
            }
        } else {
            Ux.sexMessage(reference, "empty")
        }
    },
    actions: {
        $opStep1: (reference) => (params = {}) => {
            // const request = Ux.valueValid(params);
            const request = {};
            const user = Ux.isLogged();
            request.tableId = params['actTableName'];
            request.tenantId = user.company;
            request.page = 1;
            request.rows = 10000;
            Dsl.of(reference).bind(Of.apiTableColumn).ok(response => {
                const columns = response.rows;
                // 第一步设置相关项
                const ref = Ux.onReference(reference, 3);
                if (ref) {
                    ref.setState({$columnsAct: columns})
                }
                Ux.fn(reference).rxNext({action: Ux.valueValid(params)});
            }).async(request);
        },
        $opStep3: (reference) => (params = {}) => {
            const request = Ux.valueValid(params);
            Ux.fn(reference).rxNext({action: request});
        },
        $opStep4: (reference) => (params = {}) => {
            if (beforeVerify(reference, params)) {
                const request = beforeRequest(reference, params);
                const submitting = Populate.P3Submitting(reference, request);
                Dsl.of(reference).bind(Of.apiModelPhase3).ok(response => {
                    Ux.fn(reference).rxNext(request);
                }).async(submitting);
            }
        },
        $opRestart: (reference) => (params = {}) => {
            if (beforeVerify(reference, params)) {
                const request = beforeRequest(reference, params);
                const submitting = Populate.P3Submitting(reference, request);
                Dsl.of(reference).bind(Of.apiModelPhase3).ok(response => {
                    Ux.fn(reference).rxFirst(request);
                }).async(submitting);
            }
        }
    }
}