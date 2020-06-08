import Ux from 'ux';
import Fn from '../functions';

export default {
    uri: (key) => Ux.ajaxGet("/api/x-api/:key", {key})
        .then((uri = {}) => Ux.promise(Fn.inApi(uri))),
    apis: (params = {}) => {
        const $request = Ux.clone(params);
        $request.criteria[""] = true;
        return Ux.ajaxPost("/api/x-api/search", $request).then((response = []) => {
            return Ux.promise(response);
        })
    }
}