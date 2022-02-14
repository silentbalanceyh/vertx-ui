import Ux from "ux";

const asyncImage = (config = {}, $session) => {
    const {uri = "", method = "POST"} = config.ajax ? config.ajax : {};
    const headers = {};
    if ($session) {
        headers[Ux.Env.X_HEADER.X_SESSION] = $session;
    }
    if ("POST" === method) {
        return Ux.ajaxPull(uri, {}, {headers}).then(response => new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target.result);
            const blob = new Blob([response], {type: "image/png"});
            reader.readAsDataURL(blob);
        }))
    } else {
        console.error("暂不支持")
    }
}
const rxImage = (reference) => (event) => {
    Ux.prevent(event);
    const {config = {}, $session} = reference.props;
    reference.setState({$imageLoading: true});
    return asyncImage(config, $session).then($image => {
        const state = {};
        state.$imageLoading = false;
        state.$image = $image;
        reference.setState(state);
    })
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    asyncImage,
    rxImage,
}