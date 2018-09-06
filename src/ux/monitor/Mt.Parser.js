import QPaser from './Mt.Parser.Query';
import QElement from './Mt.Parser.Element';
import System from './Mt.Parser.System';

const datumQuery = (reference) => {
    const {$query, $router} = reference.props;
    const vector = {};
    // 是否传入了pager
    vector.name = $router.path();
    vector.color = "#666";
    vector.children = [];
    const counter = [true];
    if ($query.is()) {
        const query = $query.to();
        if (query.pager) {
            const pager = QPaser.parsePager(query.pager);
            vector.children.push(pager);
        }
        if (query.sorter) {
            const sorter = QPaser.parseSorter(query.sorter);
            vector.children.push(sorter);
        }
        if (query.projection) {
            const projection = QPaser.parseProjection(query.projection);
            vector.children.push(projection);
        }
        if (query.criteria) {
            const criteria = QPaser.parseCriteria(query.criteria, counter);
            vector.children.push(criteria);
        }
    }
    return {
        items: vector,
        layout: {
            height: 380 + counter.length * 40,
            hgap: 120,
            vgap: 10
        }
    };
};
const datumTree = (object = {}) => {
    const vector = {};
    vector.name = "[Object] Root";
    vector.color = "#666";
    const counter = [true];
    vector.children = QElement.toChildren(object, counter);
    return {
        items: vector,
        layout: {
            height: counter.length * 40,
            hgap: 100,
            vgap: 10
        }
    };
};
export default {
    ...System,
    datumQuery,
    datumTree
}