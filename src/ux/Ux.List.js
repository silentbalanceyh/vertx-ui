import Value from './Ux.Value';
import Immutable from 'immutable';
import U from 'underscore';

const irPager = (hoc = {}) => {
    let pager = {};
    if (hoc.pager) {
        if ("string" === typeof hoc.pager) {
            const pageData = hoc.pager.split(',');
            pager.page = Value.valueInt(pageData[0]);
            pager.size = Value.valueInt(pageData[1]);
        } else {
            pager = Immutable.fromJS(hoc.pager).toJS();
        }
    }
    return pager;
};

const irProjection = (hoc = {}) => {
    let projection = [];
    if (U.isArray(hoc.projection)) {
        projection = Immutable.fromJS(hoc.projection).toJS();
    }
    return projection;
};

const irSorter = (hoc = {}) => {
    let sorterData = [];
    if (hoc.sorter) {
        if (U.isArray(hoc.sorter)) {
            sorterData = Immutable.fromJS(hoc.sorter).toJS();
        } else {
            const sorters = hoc.sorter.split(',');
            sorters.forEach(sorter => {
                const kv = sorter.replace(/ /g, '').split('=');
                const sorterItem = `${kv[0]},${kv[1]}`;
                sorterData.push(sorterItem);
            })
        }
    }
    return sorterData;
};

const irCriteria = (hoc = {}, props = {}) => {
    let config = {};
    if (hoc.criteria) {
        if ("string" === typeof hoc.criteria) {
            const condition = hoc.criteria.split(',');
            condition.forEach(cond => {
                const kv = cond.replace(/ /g, '').split('=');
                config[kv[0]] = kv[1]
            })
        } else {
            config = Immutable.fromJS(hoc.criteria).toJS();
        }
    }
    return Value.valueSearch(config, props);
};

const irGrid = (hoc = {}, props = {}) => {
    const query = {};
    // pager专用处理
    query.pager = irPager(hoc);
    // projection专用处理
    query.projection = irProjection(hoc);
    // sorter专用处理
    query.sorter = irSorter(hoc);
    // criteria条件处理
    query.criteria = irCriteria(hoc, props);
    return query;
};
export default {
    irGrid
}