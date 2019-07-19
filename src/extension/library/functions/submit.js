import Ux from 'ux';

const submitLogin = (reference) => {
    reference.setState({$loading: false});
    Ux.writeTree({
        "status.submitting": undefined
    })
};
export default {
    submitLogin
}