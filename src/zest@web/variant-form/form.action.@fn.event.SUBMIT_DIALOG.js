import __Zn from './zero.form.dependency';
import __Ft from './form.__.fn.run.common';

export default (reference, config = {}, redux = false) => (event) => {
    __Zn.prevent(event);
    return __Ft.runSubmit(reference, redux).then(data => {
        // Fix: https://e.gitee.com/wei-code/issues/table?issue=I6YVLS
        const eventFn = __Ft.runEventFn(reference, config);
        return eventFn(data);
    }).catch(error => {


        return __Zn.ajaxError(reference, error);
    })
}
