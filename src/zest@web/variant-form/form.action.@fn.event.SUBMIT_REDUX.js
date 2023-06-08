import __Zn from './zero.form.dependency';
import __Ft from './form.__.fn.run.common';

export default (reference, config = {}) => (event) => {
    __Zn.prevent(event);

    __Zn.writeSubmit(reference);

    return __Ft.runSubmit(reference, true).then(data => {

        const eventFn = __Ft.runEventFn(reference, config);
        return eventFn(data);
    }).then(response => {


        return __Ft.runCallback(reference, config, response);
    }).catch(error => {
        const {redux} = error;
        if (redux) {
            // redux 还原
            __Zn.writeSubmit(reference, false);
        }
        return __Zn.ajaxError(reference, error);
    })
}