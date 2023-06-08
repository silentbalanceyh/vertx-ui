import yiPage from './O.fn.init';
import Ux from 'ux';
import Data from './O.data';

const yuPage = (reference) => {
    const {$loading = false} = reference.state;
    if ($loading) {
        const state = Ux.clone(reference.state);
        Ux.toLoading(() => Data.yiData(reference, state)
            .then(Ux.ready)
            .then(Ux.pipe(reference)), 10)
    }
};
export default {
    /*
     * i - Initial：componentDidMount
     * u - Update：componentDidUpdate
     * o - Out：componentWillUnmount
     */
    yiPage,
    yuPage
}