import Op from '../op';

export default {
    scissor: (reference, item, config = {}) => {
        const {span} = config;
        return !(undefined !== span && span >= 10 && 0 === span % 2);
    },
    "left-square": (reference, item, config = {}) => {
        const {data = []} = reference.props;
        const dim = Op.cellSpanDim(data);
        if (1 === dim.length) {
            // 已经对齐了
            const min = Op.cellSpanMin(data);
            return (6 >= min);
        } else {
            // 未对齐
            const max = Op.cellSpanMax(data);
            return (6 >= max);
        }
    }
}