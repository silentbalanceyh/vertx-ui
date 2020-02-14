import Ut from '../unity';
import Eng from '../engine';

export default (reference, config = {}) => {
    const {
        dataKey = "data.category",
        parentField = "parentId"
    } = config;
    let identifier = null;
    const {$options = {}, $identifier} = reference.props;
    if ($identifier) {
        identifier = $identifier;
    } else {
        const {tree = []} = $options;
        if (0 < tree.length) {
            const treeArray = Eng.onDatum(reference, dataKey);
            identifier = Ut.treeShared(tree, treeArray, {
                parent: parentField,
                target: "identifier"
            });
        }
    }
    return identifier;
};