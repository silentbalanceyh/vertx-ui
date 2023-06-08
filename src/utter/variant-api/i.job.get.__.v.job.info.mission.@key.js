import Ux from 'ux';
import __In from '../levy.fn.in.economy.remote';

export default {
    // failure
    inData: (key) => ({key}),
    // api
    uri: `/api/job/info/mission/:key`,
    // method
    method: Ux.Env.HTTP_METHOD.GET,
    // catch
    outData: (mission) => Ux.promise(__In.inJob(mission)),
}