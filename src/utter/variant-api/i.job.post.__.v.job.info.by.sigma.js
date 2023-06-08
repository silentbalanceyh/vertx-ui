import Ux from 'ux';
import __In from '../levy.fn.in.economy.remote';

export default {
    // failure
    inData: (params = {}) => {
        const request = Ux.clone(params);
        request.criteria[""] = true;
        return request;
    },
    // api
    uri: `/api/job/info/by/sigma?group=true`,
    // method
    method: Ux.Env.HTTP_METHOD.POST,
    // catch
    outData: (response = []) => {
        const {list = [], count, aggregation = {}} = response;
        const jobs = [];
        list.forEach((mission = {}) => {
            const processed = __In.inJob(mission);
            /*
             * 不为空的时候执行 push 将 job 压入
             */
            if (!Ux.isEmpty(processed)) {
                jobs.push(processed);
            }
        });
        return Ux.promise({list: jobs, count, aggregation});
    }
}