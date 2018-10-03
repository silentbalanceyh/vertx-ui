import Ux from "ux";

const getHoc = (reference) => {
    const {config = {}} = reference.props;
    const hoc = {};
    hoc.columns = Ux.xtColumn(reference, config.columns);
    return hoc;
};
export default {
    getHoc
};