import T from "../util";

export default (reference) => (selectedOptions) => {
    // 被选中的option
    const option = selectedOptions[selectedOptions.length - 1];
    option.loading = true;
    if ("country" === option.type) {
        // 选中的是国家
        T.loadState(reference, option.params)
            .then(T.onCallback(reference, "state", option));
    } else if ("state" === option.type) {
        T.loadCity(reference, option.params)
            .then(T.onCallback(reference, "city", option));
    } else if ("city" === option.type) {
        T.loadRegion(reference, option.params)
            .then(T.onCallback(reference, "region", option));
    }
};