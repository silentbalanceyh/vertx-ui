import Ex from 'ex';

const yiRelation = (reference) => {
    const {config = {}} = reference.props;
    const {relation = {}} = config;
    const state = {};
    if (relation.definition) {
        Ex.I.relation().then(definitions => {
            state.$definition = definitions;
            state.$ready = true;
            reference.setState(state);
        })
    } else {
        state.$ready = true;
        state.$definition = false;
        reference.setState(state);
    }
};
export default {
    yiRelation
}