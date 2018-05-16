import Ux from 'ux';
import Mock from './mock'

const fnAdd = (reference: any) => (event: any) => {
    event.preventDefault();
    Ux.runSubmit(reference, values => {
        const promise = Ux.ajaxPost("/api/department", values, Mock.fnAdd);

        promise.then(data => {
            Ux.showMessage(reference, "add");
            Ux.fadeOut(reference);
            Ux.writeTree(reference, {"datum.data": undefined});
        });
    });
};
const fnSave = (reference: any) => (event: any) => {
    event.preventDefault();
    Ux.runSubmit(reference, values => {
        const promise = Ux.ajaxPut("/api/department/:key", values, Mock.fnSave);
        promise.then(data => {
            Ux.showMessage(reference, "edit");
            Ux.fadeOut(reference);
            Ux.writeTree(reference, {
                "datum.data": undefined,
                "datum.record": data
            });
        });
    });
};
export default {
    fnAdd,
    fnSave
}