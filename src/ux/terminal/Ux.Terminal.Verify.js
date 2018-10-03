import E from "../Ux.Error";
import U from 'underscore';
import Prop from "../prop";

const calcKey = (key) => {
    if (!key.startsWith("_")) key = `_${key}`;
    return key;
};

const verifyRooKey = (reference, key = "") => {
    const {$hoc} = reference.state;
    key = calcKey(key);
    const value = $hoc._(key);
    if (!value) {
        const name = $hoc.name();
        return E.fxMessageError(10001, name, key);
    }
};

const verifyQuery = (key, query) => {
    key = calcKey(key);
    if (!query) {
        return E.fxMessageError(10009, key, 'query');
    }
    if (!query.projection) {
        return E.fxMessageError(10009, `${key}.query`, 'projection')
    }
    if (!U.isArray(query.projection)) {
        return E.fxMessageError(10010, `${key}.query.projection`, 'Array')
    }
    if (!query.pager) {
        return E.fxMessageError(10009, `${key}.query`, 'pager')
    }
    if (!query.sorter) {
        return E.fxMessageError(10009, `${key}.query`, 'sorter')
    }
    if (!query.criteria) {
        return E.fxMessageError(10009, `${key}.query`, 'criteria')
    }
};

const verifyOptions = (key, options) => {
    key = calcKey(key);
    if (!options) {
        return E.fxMessageError(10009, key, 'options');
    }
    if (!options['tabs.list']) {
        return E.fxMessageError(10009, `${key}.options`, 'tabs.list')
    }
};

/**
 * 专用ComplexList的错误检测函数
 * @param reference
 * @param key
 */
const verifyComplex = (reference = {}, key = "") => {
    // 检查基础配置key下边有内容
    let message = verifyRooKey(reference, key);
    if (!message) {
        const grid = Prop.fromHoc(reference, key);
        message = verifyQuery(key, grid.query);
        // 其他验证
        if (!message) {
            message = verifyOptions(key, grid.options);
        }
    }
    return message;
};
const verifyCard = (ref = {}) => {
    const {$key = "page", reference} = ref.props;
    let message = verifyRooKey(reference, $key);
    // TODO: 后期处理
    return message;
};
const verifySubList = (ref) => {
    const {$key = "_sublist", reference} = ref.props;
    let message = verifyRooKey(reference, $key);
    if (!message) {
        // TODO后期处理
    }
    return message
};
const verifyTreeList = (ref, key = "") => {
    let message = verifyRooKey(ref, key);
    if (!message) {

    }
    return message;
};
export default {
    verifyRooKey,
    verifyQuery,
    verifyOptions,
    // 验证专用
    verifyCard,
    verifyComplex,
    verifySubList,
    verifyTreeList
}