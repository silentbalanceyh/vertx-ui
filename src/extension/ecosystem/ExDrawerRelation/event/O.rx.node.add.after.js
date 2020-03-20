import Ux from 'ux';

export default (reference) => (node = {}) => {
    const {model} = node;
    if (model.data) {
        const {identifier} = model.data;
        if (identifier) {
            const {$dropped} = reference.state;
            const droppedSet = new Set($dropped);
            droppedSet.add(identifier);
            /* 添加合并 */
            let $replaced = Array.from(droppedSet);
            $replaced = Ux.clone($replaced);
            reference.setState({$dropped: $replaced});
        }
    }
}