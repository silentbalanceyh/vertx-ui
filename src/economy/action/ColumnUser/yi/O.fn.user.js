import Ux from 'ux';

const yiValue = (reference, value = "", isPerson = false) => {
    const state = {};
    state.value = value;
    state.$ready = true;
    state.$system = !isPerson;
    reference.setState(state);
};
export default (reference) => {
    const {config, $empty = "", $key} = reference.props;
    if (config) {
        const {uri, field} = config;
        if (uri && field && $key) {
            Ux.ajaxGet(uri, {key: $key})
                .then(result => {
                    if (Ux.isEmpty(result)) {
                        yiValue(reference, $empty);
                    } else {
                        const value = result[field];
                        yiValue(reference, value, true);
                    }
                })
                .catch(error => {
                    console.error(error);
                    yiValue(reference, $empty);
                })
        } else {
            yiValue(reference, $empty);
        }
    } else {
        yiValue(reference, $empty);
    }
};