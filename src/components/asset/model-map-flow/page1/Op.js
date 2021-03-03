import Ux from 'ux';
import {Of} from "app";
import {Dsl} from 'entity';
import Connect from '../Op.connect';
import Populate from '../Populate.Data'

export default {
    ...Connect,
    rxStep2: (reference) => (event) => {
        Ux.prevent(event);
        const {$keySet} = reference.state;
        if ($keySet) {
            const columns = Array.from($keySet);
            if (0 < columns.length) {
                Ux.fn(reference).rxNext({columns});
            } else {
                Ux.sexMessage(reference, "empty")
            }
        } else {
            Ux.sexMessage(reference, "empty")
        }
    },
    actions: {
        $opStep1: (reference) => (params = {}) => {
            const request = {};
            const user = Ux.isLogged();
            request.tableId = params['tableName'];
            request.tenantId = user.company;
            request.page = 1;
            request.rows = 10000;
            Dsl.of(reference).bind(Of.apiTableColumn).ok(response => {
                const columns = response.rows;
                // 第一步设置相关项
                const ref = Ux.onReference(reference, 3);
                if (ref) {
                    ref.setState({$columns: columns})
                }
                Ux.fn(reference).rxNext(Ux.valueValid(params));
            }).async(request);
        },
        $opStep3: (reference) => (params = {}) => {
            const request = Ux.valueValid(params);
            const {$inited = {}} = reference.props;
            Object.assign(request, $inited);
            const submitting = Populate.P1Submitting(reference, request);
            Dsl.of(reference).bind(Of.apiModelPhase1).ok(response => {
                // Ux.dgFileJson(request);
                Ux.fn(reference).rxNext(request);
            }).async(submitting);
        }
    },
}