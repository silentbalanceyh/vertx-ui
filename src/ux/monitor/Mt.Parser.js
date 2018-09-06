import Ux from 'ux';
import QPaser from './Mt.Parser.Query';

const datumEnv = (reference) => {
    const envs = Ux.Env;
    const comment = Ux.fromHoc(reference, "comment");
    const data = [];
    Ux.itObject(comment, (field, value) => {
        const array = value.split(',');
        const item = {};
        item.key = field;
        item.original = array[0];
        item.current = field;
        item.value = envs[field];
        item.type = typeof item.value;
        item.support = array[2] ? array[2] : "--";
        item.comment = array[1];
        data.push(item);
    });
    return data.sort((left, right) => Ux.sorterAsc(left, right, 'current'));
};
const datumPure = (object = {}) => {
    const data = [];
    Ux.itObject(object, (field, value) => {
        const item = {};
        item.key = field;
        item.current = field;
        item.value = value;
        item.type = typeof value;
        data.push(item);
    });
    return data;
};
const datumQuery = (reference) => {
    const {$query, $router} = reference.props;
    const vector = {};
    // 是否传入了pager
    vector.name = $router.path();
    vector.color = "#666";
    vector.children = [];
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
            const criteria = QPaser.parseCriteria(query.criteria);
            vector.children.push(criteria);
        }
    }
    return {
        items: vector,
        layout: {
            height: 380,
            hgap: 120,
            vgap: 10
        }
    };
};
export default {
    datumEnv,
    datumPure,
    datumQuery
}