import Ux from 'ux';
import T from './Op.T';

import {Dsl} from 'entity';
import {Of} from 'app';

export default {
    /*
     * 连接点专用
     */
    $opSearchForm: (reference) => (event) => {
        Ux.prevent(event);
        Ux.connectId("$opSearch");
    },
    $opSearchReset: (reference) => (event) => {
        Ux.prevent(event);
        Ux.connectId("$opReset");
    },
    $opSearchChange: (reference) => (event) => {
        const $keyword = Ux.ambEvent(event);
        reference.setState({$keyword});
    },

    actions: {
        $opSearch: (reference) => (params) => {
            const request = Ux.valueValid(params);
            Ux.formRedo(reference);
            Ux.fn(reference).rxSubmit(request);
        }
    },
    $opSearchQuick: (reference) => (keyword) => {
        const $query = T.rxDataQuery(reference, "keyword", keyword);
        T.rxDataRefresh(reference, $query)
    },
    events: {
        $opView: (reference) => (text, record) => {
            Ux.toRoute(reference, "/persona/tag-system-create", {key: text, action: "VIEW"})
        },
        $opEdit: (reference) => (text, record) => {
            Ux.toRoute(reference, "/persona/tag-system-create", {key: text, action: "EDIT"})
        },
        $opDelete: (reference) => (text, record) => {
            reference.setState({$submitting: true})
            Dsl.of(reference).bind(Of.apiTagDelete).ok(response => {
                Ux.sexDialog(reference, "deleted",
                    () => {
                        const {$query = {}} = reference.state;
                        T.rxDataRefresh(reference, $query);
                    })
            }).async(record)
        },
        $opAdd: (reference) => (event) => {
            Ux.prevent(event);
            // 进入页面 tag-basic-create
            Ux.toRoute(reference, "/persona/tag-system-create")
        }
    }
}