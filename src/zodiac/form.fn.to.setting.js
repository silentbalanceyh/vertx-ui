import __Zn from './zero.module.dependency';

const toForm = (staticForm = {}, dynamicForm = {}) => {
    /*
     * form：输入的 form
     * dynamicForm：动态输入的 form
     * 1）执行 ui 的合并
     * 2）执行 hidden 的合并
     * 3）执行 initial 的合并
     * 4）执行 op 的合并
     * 5）执行 mapping 的合并
     * 6）执行 io 的合并
     * 7）执行 modal 的合并
     * 8）执行 assist 的合并
     *
     * 唯一不执行合并的是 as / segment
     * 最新版本中引入了 io 部分的合并，io包括：
     * 1）reader：读取数据时执行的转换，修改 $inited 数据
     * 2）writer：提交数据（验证之前）的转换，修改 request 数据
     */
    // 先执行拷贝
    const form = staticForm ? __Zn.clone(staticForm) : {};
    /*
     * 动态中的属性优先
     */
    const {
        ui = [],
        hidden = [],
        initial = {},
        mapping = {},
        io = {},
        modal = {},
        assist = {},
        ...rest
    } = dynamicForm;
    if (!__Zn.isEmpty(rest)) {
        Object.assign(form, rest);
    }
    /*
     * 合并 ui 项
     */
    if (__Zn.isArray(ui) && 0 < ui.length) {
        if (!form.ui) form.ui = [];
        form.ui = [].concat(form.ui, ui);
    }
    if (__Zn.isArray(hidden) && 0 < hidden.length) {
        if (!form.hidden) form.hidden = [];      // 防止原生未配置
        form.hidden = [].concat(form.hidden, hidden);
    }
    /*
     * - assist
     * - initial
     * - mapping
     * - io
     * - modal
     */
    if (__Zn.isNotEmpty(assist)) {
        if (!form.assist) form.assist = {};
        Object.assign(form.assist, assist);
    }
    if (__Zn.isNotEmpty(initial)) {
        if (!form.initial) form.initial = {};
        Object.assign(form.initial, initial);
    }
    if (__Zn.isNotEmpty(mapping)) {
        if (!form.mapping) form.mapping = {};
        Object.assign(form.mapping, mapping);
    }
    if (__Zn.isNotEmpty(io)) {
        if (!form.io) form.io = {};
        Object.assign(form.io, io);
    }
    if (__Zn.isNotEmpty(modal)) {
        if (!form.modal) form.modal = {};
        // Assign 必须这样处理
        form.modal = __Zn.assign(form.modal, modal, 2);
    }
    return form;
};

const toFormUi = (ui = [], segment = {}) => {
    // ui迭代
    if (__Zn.isArray(ui)) {
        const uiAfter = [];
        ui.forEach(row => {
            const rowAfter = [];
            if (__Zn.isArray(row)) {
                // row 必须也是数组
                row.forEach((cell, cellIndex) => {
                    // 查看 cell 是否 complex 类型
                    if (cell.complex) {
                        /*
                         *  特殊类型提取
                         *  {
                         *      "complex": true,
                         *      "config": {
                         *          "pages": {
                         *               "key": []
                         *          }
                         *      }
                         *  }
                         */
                        const cellAdd = __Zn.clone(cell);
                        if (cellAdd.config && cellAdd.config['pages']) {
                            const {pages = {}} = cellAdd.config;
                            const pagesAdd = {};
                            Object.keys(pages).forEach(key => {
                                const pageForm = pages[key];
                                if (pageForm && __Zn.isArray(pageForm.ui)) {
                                    /*
                                     * 「递归」复杂页面直接执行递归替换
                                     */
                                    pagesAdd[key] = __Zn.clone(pageForm);
                                    pagesAdd[key].ui = toFormUi(pageForm.ui, segment);
                                }
                            });
                            cellAdd.config.pages = pagesAdd;
                        }
                        rowAfter.push(cellAdd);
                    } else {
                        if (__Zn.isObject(cell)) {
                            /*
                             * Object单元格普通追加
                             * [
                             *     {},{},{}
                             * ]
                             */
                            rowAfter.push(cell);
                        } else if ("string" === typeof cell) {
                            const target = segment[cell];
                            if (__Zn.isArray(target)) {
                                // Cell 列连接
                                target.filter(__Zn.isArray).filter(__Zn.isNotEmpty)
                                    // Ui 追加都要考虑不为空
                                    .forEach(each => uiAfter.push(each))
                            } else {
                                /*
                                 * String单元格普通追加
                                 * [
                                 *     "","",""
                                 * ]
                                 */
                                rowAfter.push(cell);
                            }
                        } else {
                            console.warn("列连接非法", cell);
                        }
                    }
                })
            } else if ("string" === typeof row) {
                // Row 行连接
                const target = segment[row];
                // 二维数组追加到一维数据
                if (__Zn.isArray(target)) {
                    // Ui 追加都要考虑不为空
                    target.filter(__Zn.isArray).filter(__Zn.isNotEmpty)
                        .forEach(each => uiAfter.push(each))
                }
            }
            if (__Zn.isNotEmpty(rowAfter)) {
                // Ui 追加都要考虑不为空
                uiAfter.push(rowAfter);
            }
        })
        return uiAfter;
    } else {
        console.error("数据格式非法", ui)
        return [];
    }
}
export default {
    toForm,
    toFormUi,
}