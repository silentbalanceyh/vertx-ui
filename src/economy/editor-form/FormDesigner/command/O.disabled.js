export default {
    scissor: (reference, item, config = {}) => {
        const {span} = config;
        return !(undefined !== span && span >= 10 && 0 === span % 2);
    }
}