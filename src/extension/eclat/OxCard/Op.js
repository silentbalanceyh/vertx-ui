import {HocI18r} from 'entity';

const yiCard = (reference) => {
    const state = {};
    /*
     * 构造 Hoc
     */
    const {config = {}} = reference.props;
    state.$hoc = new HocI18r({
        _page: config,
    });
    state.$ready = true;
    reference.setState(state);
};
export default {
    yiCard,
}