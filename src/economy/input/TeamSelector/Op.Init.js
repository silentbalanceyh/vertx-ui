import Ux from 'ux';

const getDefault = () => ({
    $visible: false,
    $loading: false,
    $data: [],
    $select: undefined,
});

const initState = (reference) => {
    const state = Ux.xtInitSource(reference.props);

    return state;
};
export default {
    getDefault,
    initState,
};