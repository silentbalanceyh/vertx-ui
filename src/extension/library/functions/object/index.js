import ExQuery from './O.query';

export default {
    newQuery: (query = {}) => new ExQuery(query),
}