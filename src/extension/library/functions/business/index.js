import form from './form';
import dialog from './dialog';
import init from './init';
import todo from './todo';
import bind from './bind';
import relation from './relation';
import Job from './job';

export default {
    /*
     * 表单提交
     */
    form,
    dialog,
    init,
    todo,
    ...Job,

    ...relation,
    ...bind,
}