import Immutable from 'immutable';
import Ux from 'ux';

const isGridUpdated = (reference, query = {}, column) => {
    const {$query} = reference.state;
    // 没有query时，直接返回true
    if (!$query) return true;
    // pager检查
    let previous = Immutable.fromJS($query.pager);
    let current = Immutable.fromJS(query.pager);
    if (!Immutable.is(previous, current)) return true;
    // criteria改变
    previous = Immutable.fromJS($query.criteria);
    current = Immutable.fromJS(query.criteria);
    if (!Immutable.is(previous, current)) return true;
    // sorter改变
    if (column && column.sorter) {
        // 必须是sorter本身为true
        previous = Immutable.fromJS($query.sorter);
        current = Immutable.fromJS(query.sorter);
        if (!Immutable.is(previous, current)) return true;
    }
    return false;
};
const initStateQuery = (reference, query = {}) => {
    const {$query} = reference.state;
    if (!$query) {
        reference.setState({$query: query});
    }
};
const initReduxQuery = (reference, query = {}) => {
    const queryData = Ux.irGrid(query, reference.props);
    Ux.writeTree(reference, {"grid.query": queryData});
};
export default {
    isGridUpdated,
    initStateQuery,
    initReduxQuery
};