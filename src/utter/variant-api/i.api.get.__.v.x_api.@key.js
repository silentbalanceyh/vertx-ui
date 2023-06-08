import Ux from 'ux';
import __In from '../levy.fn.in.economy.remote';

export default {
    // failure
    inData: (key) => ({key}),
    // api
    uri: `/api/x-api/:key`,
    // method
    method: Ux.Env.HTTP_METHOD.GET,
    outData: (mission) => Ux.promise(__In.inApi(mission)),
}