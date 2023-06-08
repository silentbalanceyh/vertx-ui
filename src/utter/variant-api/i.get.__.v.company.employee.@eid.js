import Ux from 'ux';

export default {
    // failure
    inData: (user = {}) => ({eid: user.employeeId}),
    // api
    uri: `/api/company/employee/:eid`,
    // method
    method: Ux.Env.HTTP_METHOD.GET,
    // catch
}