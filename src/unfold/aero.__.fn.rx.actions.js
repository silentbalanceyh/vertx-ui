import Ux from 'ux';
import __ACTIONS from "./aero-meta-action";
import {_Locator} from "zei/allocation.__.c.locator.navigation";
/*
 * Menu click for executing
 * 1. When the uri exist here, the system navigate us to target uri.
 * 2. If there exist `function` in metadata, execute the function first ( High Priority )
 */
const rxMenuWith = (reference, menuData = []) => (event) => {
    // _config from resource in `Cab.json` configuration data
    const config = Ux.inConfig(reference);

    // menu data extracting from clicked
    const found = Ux.elementUnique(menuData, 'key', event.key);
    const {data = {}} = found;
    const {metadata = {}} = data;

    /*
     * P1: metadata.function is the first
     * P2: data.uri as Ux.toRoute
     */
    if (__ACTIONS.hasOwnProperty(metadata.function)) {
        const executor = __ACTIONS[metadata.function];
        const configuration = config[metadata.function];
        if (Ux.isFunction(executor)) {
            // reference, data, config
            executor(reference, data, configuration);
        }
    } else {
        // react-router action triggered.
        const locator = _Locator.create(reference);
        locator.goPage(data);
        // Ux.toRoute(reference, data.uri);
    }
}
const rxMenuOr = (reference, item, dom) => (event) => {
    Ux.prevent(event);
    const locator = _Locator.create(reference);
    const {data = {}} = item;
    const {$menuData = [], $route} = reference.state;
    const nodeBag = Ux.elementUnique($menuData, 'key', data.parentId);
    if (nodeBag && $route.hasOwnProperty(nodeBag.key)) {
        locator.goActive(data);
    } else {
        locator.goPage(data);
    }
}
export default {
    rxMenuWith,
    rxMenuOr,
}