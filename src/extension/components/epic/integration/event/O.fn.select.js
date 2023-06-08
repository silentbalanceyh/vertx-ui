import Ux from 'ux';

export default (reference) => (node) => {
    /* 选择按钮 */
    const {selectedKeys = []} = node;
    let $selected;
    let $model;
    if (selectedKeys[0]) {
        const category = Ux.elementUniqueDatum(reference, "data.category",
            "key", selectedKeys[0]);
        if (category) {
            $selected = category.identifier;
            $model = category.name;
        }
    }
    Ux.of(reference).in({
        $selected,
        $model
    }).done();
    // reference.?etState(state);
    // reference.?etState({$selected, $model});
}