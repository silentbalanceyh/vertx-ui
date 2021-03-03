import {Of} from "app";
import {Dsl} from 'entity';
import Ux from 'ux';

function rxDataRefresh(reference, $query = {}, state) {
    if (2 === arguments.length) {
        console.debug("测试效果")
        reference.setState({$submitting: true});
    }
    Ux.toLoading(() => {
        const replaced = state ? state : (reference.state ? Ux.clone(reference.state) : {});
        Dsl.of(reference).bind(Of.apiTagSearch).ok(response => {
            replaced.$data = response;
            replaced.$query = $query;
            replaced.$ready = true;
            replaced.$submitting = false;
            // $keyword
            if ($query.criteria) {
                replaced.$keyword = $query.criteria.keyword;
            }
            reference.setState(replaced);
        }).async($query);
    }, 80)
}

function rxDataQuery(reference) {
    let {$query = {}} = reference.state;
    $query = Ux.clone($query);
    if (!$query.criteria) $query.criteria = {};
    if (2 === arguments.length) {
        const merged = arguments[1];
        if (Ux.isObject(merged)) {
            Object.assign($query.criteria, merged);
        }
    } else if (3 === arguments.length) {
        const field = arguments[1];
        const value = arguments[2];
        if (field) {
            if (value) {
                $query.criteria[field] = value;
            } else {
                if ($query.criteria.hasOwnProperty(field)) {
                    delete $query.criteria[field];
                }
            }
        }
    }
    return $query;
}

const rxDataSearch = (reference) => (request = {}) => {
    const $query = rxDataQuery(reference, request);
    rxDataRefresh(reference, $query);
}

export default {
    rxDataRefresh,
    rxDataQuery,
    rxDataSearch,
}