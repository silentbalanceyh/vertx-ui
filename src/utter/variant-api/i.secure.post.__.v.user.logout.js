import Ux from 'ux';

export default {
    // failure
    inData: () => ({}),
    // api
    uri: `/api/user/logout`,
    // method
    method: Ux.Env.HTTP_METHOD.POST,
    // catch
    outFail: (error) => {
        console.error(error);
        return Ux.promise({unauthorized: true});
    }
}