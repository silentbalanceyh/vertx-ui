import __Zn from './zero.form.dependency';
import __Ft from './form.__.fn.run.common';

export default (reference, config = {}) => (event) => {
    __Zn.prevent(event);

    __Zn.formReset(reference);

    const eventFn = __Ft.runEventFn(reference, config);
    eventFn(event);
}