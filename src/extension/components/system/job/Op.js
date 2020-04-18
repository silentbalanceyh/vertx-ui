import Ex from 'ex';
import Ux from 'ux';
import yiPage from './Op.Yi';

const yuPage = (reference) => {
    const {$loading = false} = reference.state;
    if ($loading) {
        let state = reference.state;
        Ux.toLoading(() => Ex.I.jobs().then((data = []) => {
            state = Ux.clone(state);
            state.$loading = false;
            state.$data = data;
            reference.setState(state);
        }))
    }
};
const yoPage = (reference) => {
    const {$timer} = reference.state;
    if ($timer) {
        clearInterval($timer);
        /*
         * 更新 $timer 设置
         */
        reference.setState({$timer: undefined});
    }
};
export default {
    /*
     * i - Initial：componentDidMount
     * u - Update：componentDidUpdate
     * o - Out：componentWillUnmount
     */
    yiPage,
    yuPage,
    yoPage
}