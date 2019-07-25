import Ux from "ux";
import U from "underscore";
import To from './func.to';
import mapButtons from './func.map.buttons';

const mapMeta = (data = {}) => {
    if ("string" === typeof data.metadata) {
        data.metadata = Ux.toJson(data.metadata);
    }
    return data;
};

const mapUri = (item = {}, $app) => {
    if ($app && U.isFunction($app.is) && item.uri) {
        if ("EXPAND" !== item.uri) {
            item.uri = To.toUri(item.uri, $app);
        } else {
            item.uri = undefined;
        }
    }
    return item;
};
export default {
    mapUri,
    mapMeta,
    mapButtons,
}
