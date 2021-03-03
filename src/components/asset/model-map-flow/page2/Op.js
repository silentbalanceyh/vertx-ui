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
    if (params.modelRelation) {
        const {from, to} = params.modelRelation;
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
    if (!$inited.relations) {
        request.relations = [];
    } else {
        // 维持旧的 relations
        request.relations = Ux.clone($inited.relations);
    }
    const $relations = Dsl.getArray(request.relations);
    // 关系数据
    const relation = {};
    relation.key = $inited['relModelName'];
    relation.tableName = $inited['relTableName'];
    relation.modelName = $inited['relModelName'];
    relation.columnsRel = $inited['columnsRel'];
    relation.mode = params['relMode'];
    relation.createdAt = Ux.valueNow();
    relation.reference = params.modelRelation;
    $relations.saveElement(relation, 'modelName');
    request.relations = $relations.to();
    {
        // 清除关系部分的数据
        request.relation = {};
        request.relTableName = null;
        request.relModelName = null;
        request.relMode = null;
        request.modelRelation = null;
    }
    return request;
}

export default {
    ...Connect,

    rxStep2: (reference) => (event) => {
        Ux.prevent(event);
        const {$keySet} = reference.state;
        if ($keySet) {
            const columnsRel = Array.from($keySet);
            if (0 < columnsRel.length) {
                Ux.fn(reference).rxNext({relation: {columnsRel}});
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
            request.tableId = params['relTableName'];
            request.tenantId = user.company;
            request.page = 1;
            request.rows = 10000;
            Dsl.of(reference).bind(Of.apiTableColumn).ok(response => {
                const columns = response.rows;
                // 第一步设置相关项
                const ref = Ux.onReference(reference, 3);
                if (ref) {
                    ref.setState({$columnsRel: columns})
                }
                Ux.fn(reference).rxNext({relation: Ux.valueValid(params)});
            }).async(request);
        },
        $opStep3: (reference) => (params = {}) => {
            if (beforeVerify(reference, params)) {
                const request = beforeRequest(reference, params);
                const submitting = Populate.P2Submitting(reference, request);
                Dsl.of(reference).bind(Of.apiModelPhase2).ok(response => {
                    Ux.fn(reference).rxNext(request);
                }).async(submitting);
            }
        },
        $opRestart: (reference) => (params = {}) => {
            if (beforeVerify(reference, params)) {
                const request = beforeRequest(reference, params);
                const submitting = Populate.P2Submitting(reference, request);
                Dsl.of(reference).bind(Of.apiModelPhase2).ok(response => {
                    Ux.fn(reference).rxFirst(request);
                }).async(submitting);
            }
        }
    }
}