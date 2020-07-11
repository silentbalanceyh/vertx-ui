import TPage from './Op.Time'
import Ux from 'ux';

const yiPage = (reference) => {
    const state = {};
    return TPage.yiTimePage(reference, state)
        .then(state => Ux.capTab(reference, "tabs", state))
        .then(Ux.ready).then(Ux.pipe(reference))
        .catch(error => console.error(error))
};
export default {
    yiPage
}