import Ux from 'ux';

export default {
    // failure
    inData: (identifier) => ({identifier}),
    // api
    uri: `/api/ui/forms/:identifier`,
    // method
    method: Ux.Env.HTTP_METHOD.GET,
    // response
    outData: response => {
        response.forEach(item => {
            if (item.metadata && !item.metadata.hasOwnProperty('design')) {
                item.metadata.design = true;
            }
        });
        return Ux.promise(response);
    }
}