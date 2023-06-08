import __Zn from '../zero.uca.dependency';

const asyncImage = (config = {}, $session) => {
    const {uri = "", method = "POST"} = config.ajax ? config.ajax : {};
    const headers = {};
    if ($session) {
        headers[__Zn.Env.X_HEADER.X_SESSION] = $session;
    }
    if ("POST" === method) {
        return __Zn.ajaxPull(uri, {}, {headers})
            .then(response => new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target.result);
                const blob = new Blob([response], {type: "image/png"});
                reader.readAsDataURL(blob);
            }))
    } else {
        console.error("暂不支持")
    }
}
const rxRefresh = (reference) => {
    const {config = {}, $session} = reference.props;
    return __Zn.of(reference).in({
        $imageLoading: true
    }).future(() => asyncImage(config, $session).then($image => {
        const state = {};
        state.$imageLoading = false;
        state.$image = $image;
        __Zn.of(reference).in(state).done();
        // reference.?etState(state);
    }))
    // reference.?etState({$imageLoading: true});
    // return asyncImage(config, $session).then($image => {
    //     const state = {};
    //     state.$imageLoading = false;
    //     state.$image = $image;
    //     reference.?etState(state);
    // })
}
const rxImage = (reference) => (event) => {
    __Zn.prevent(event);
    rxRefresh(reference);
}
const rxError = (config, reference) => (error) => {
    const message = config.error ? config.error : {};
    const {data = {}} = error;
    const $error = message[data.status];
    if ($error && reference) {
        __Zn.of(reference).in({$error}).done();
    }
    return Promise.reject({$error})
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    asyncImage,
    rxError,
    rxImage,
    rxRefresh,
}