export default {
    scissor: (reference, item, config = {}) => {
        const {span} = config;
        return !(undefined !== span && span >= 10 && 0 === span % 2);
    },
    "left-square": (reference, item, config = {}) => {
        const {$cells = []} = reference.state;
        const min = $cells.map(cell => cell.span)
            .reduce((left, right) => {
                if (left < right) {
                    return left;
                } else {
                    return right;
                }
            }, 24);
        if (6 >= min) {
            return true;
        } else {
            return false;
        }
    }
}