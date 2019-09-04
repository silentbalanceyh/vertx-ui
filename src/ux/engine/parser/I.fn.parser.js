import parseDatum from './I.fn.datum';
import parseState from './I.fn.state';
import parseRouter from './I.fn.router';
import parseProp from './I.fn.prop';
/* 渗透处理 */
import Ut from '../../unity';

export default {
    BOOL: {
        searcher: (value) => Boolean(value)
    },
    OPERATOR: {
        searcher: (value) => "AND" === value,
    },
    DATUM: {
        parser: (kv1 = "") => Ut.formatObject(kv1),
        searcher: (value, props, state) =>
            parseDatum(value, {props, state})
    },
    PROP: {
        parser: (kv1 = "") => [kv1.split(',')],
        searcher: (value, props) =>
            parseProp(value, {props})
    },
    ENUM: {
        parser: (kv1) => kv1,
        searcher: (value) => value.split('`'),
    },
    FIX: {
        parser: (kv1) => [kv1],
        searcher: (value) => value
    },
    ROUTE: {
        parser: (kv1 = "") => [kv1],
        searcher: (value, props) =>
            parseRouter(value, {props})
    },
    STATE: {
        parser: (kv1) => [kv1.split('.')],
        searcher: (value, props, state) =>
            parseState(value, {props, state})
    }
}