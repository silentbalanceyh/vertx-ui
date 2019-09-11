import Ux from 'ux';
import To from './func.to';

const onApp = ($inited = {}) => {
    const inited = Ux.clone($inited);
    const app = Ux.isInit();
    if (!$inited.appName) {
        inited.appName = app.name;
    }
    if (!$inited.appName) {
        inited.namespace = To.toNamespace(app.name);
    }
    if (undefined === $inited.active) {
        inited.active = true;
    }
    return inited;
};
export default {
    onApp,
}