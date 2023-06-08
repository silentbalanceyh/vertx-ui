import Ux from 'ux';

const runActive = (reference, $activeKey) => {
    // Loading Start
    Ux.of(reference).in({$paging: true}).handle(() => {
        const state = {};
        state.$activeKey = $activeKey;
        state.$refresh = false;
        const {$regionData = {}} = reference.state;
        state.$regionData = $regionData;
        rxActive(state, $activeKey).then(Ux.pipe(reference))
    }, 128)
    // reference.?etState({$paging: true});
    // const state = {};
    // state.$activeKey = $activeKey;
    // state.$refresh = false;
    // const {$regionData = {}} = reference.state;
    // state.$regionData = $regionData;
    // Ux.toLoading(() => rxActive(state, $activeKey).then(Ux.pipe(reference)), 128)
}
const rxTabClick = (reference) => ($activeKey) => {
    const {$refresh = false} = reference.state;
    if ($refresh) {
        // 未保存
        rxWindow(reference)(() => runActive(reference, $activeKey));
    } else {
        // 直接处理
        runActive(reference, $activeKey);
    }
}
const rxActive = (state = {}, key) => {
    state = Ux.clone(state);
    state.$activeKey = key;
    state.$paging = false;
    const {$regionData = {}} = state;
    if (!$regionData[key]) {
        return Ux.ajaxGet("/api/authority/region-d/:key", {key}).then(response => {
            $regionData[key] = response;
            state.$regionData = $regionData;
            return Ux.promise(state);
        })
    } else {
        return Ux.promise(state);
    }
}
const rxWindow = (reference) => (callbackFn) => {
    if (Ux.isFunction(callbackFn)) {
        const config = Ux.fromHoc(reference, "window");
        config.onOk = () => callbackFn();
        const md = Ux.v4Modal()
        md.confirm(config);
    }
}
export default {
    rxTabClick,
    rxActive,
    rxWindow,
}