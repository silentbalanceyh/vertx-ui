import Ux from 'ux';

export default {
    mock: true,
    data: {},
    processor: (response, request) => {
        if ("STOP" === request.status) {
            request.status = "RUNNING";
        } else {
            request.status = "STOP";
        }
        return Ux.promise(request);
    }
}