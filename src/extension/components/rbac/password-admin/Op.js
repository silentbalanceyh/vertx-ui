import Ex from 'ex';
import Ux from "ux";

const $opWizard = (reference) => params =>
    Ex.form(reference).wizard(params, (request = {}) =>
        Ux.ajaxPost('/api/user/search', request)
            .then(result => Ux.promise(Ux.valueArray(result)))
    );
const $opPassword = (reference) => params => {
    const request = Ux.valueRequest(params);
    request.password = Ux.encryptMD5(params['npassword']);
    Ex.form(reference).save(request, {
        uri: "/api/user/:key",
        dialog: "savedMy"
    });
};

export default {
    actions: {
        $opWizard,
        $opPassword
    }
}