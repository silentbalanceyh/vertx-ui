import __Zn from './zero.module.dependency';

const Cv = __Zn.Env;

const activeColumn = ($terms = {}) => {
    Object.keys($terms)
        /* 列筛选必须调用 */
        .map(id => `${Cv.K_UI.BTN_CLEAR_PREFIX}${id}`)
        .forEach(id => {
            const ele = __Zn.element(id);
            if (ele) {
                __Zn.connectId(id);
            }
        })
};
const activeSearch = () => __Zn.connectId(Cv.K_UI.BTN_CLEAR_SEARCH);
const activeTreeOn = () => __Zn.connectId(Cv.K_UI.BTN_TREE_ON);
const activeTreeOff = () => __Zn.connectId(Cv.K_UI.BTN_TREE_OFF);
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    activeColumn,
    activeSearch,
    activeTreeOn,
    activeTreeOff,
}