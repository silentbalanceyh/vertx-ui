import form from './object.form';
import dialog from './object.dialog';
import init from './object.init';
import designer from './object.designer';

import bind from './bind';
import relation from './relation';
import Job from './job';
import Api from './api';

export default {
    /*
     * 表单提交
     * - form 标准提交
     * - dialog 窗口提交
     */
    form,
    dialog,
    /*
     * 初始化
     * - 公司信息初始化
     * - 表单设计器专用
     * rxType, rxApi
     */
    init,
    designer,

    ...Job,
    ...Api,

    ...relation,
    ...bind,
}