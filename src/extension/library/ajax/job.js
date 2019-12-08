import Ux from 'ux';
import Fn from '../functions';

export default {
    mission: (key) => Ux.ajaxGet("/api/job/info/mission/:key", {key})
        .then((mission = {}) => Ux.promise(Fn.inJob(mission))),
    jobs: () => Ux.ajaxGet("/api/job/info/by/sigma")
        .then((jobList = []) => {
            const jobs = [];
            jobList.forEach((mission = {}) => {
                const processed = Fn.inJob(mission);
                /*
                 * 不为空的时候执行 push 将 job 压入
                 */
                if (!Ux.isEmpty(processed)) {
                    jobs.push(processed);
                }
            });
            return Ux.promise(jobs);
        }),
    jobStart: (key) => Ux.ajaxPut("/api/job/start/:key", {key}),
    jobStop: (key) => Ux.ajaxPut("/api/job/stop/:key", {key}),
    jobResume: (key) => Ux.ajaxPut("/api/job/resume/:key", {key})
}