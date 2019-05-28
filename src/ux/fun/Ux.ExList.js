import Ux from 'ux';

const irExClear = (reference = {}) => (event) => {
    event.preventDefault();
    Ux.formReset(reference);
};
const irExFilter = (reference = {}) => (event) => {
    event.preventDefault();
    /* 读取表单数据 */

};
export default {
    irExClear,
    irExFilter,
}