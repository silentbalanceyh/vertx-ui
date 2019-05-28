import Verify from './Ux.Terminal.Verify';

const calcKey = (key) => {
    if (!key.startsWith("_")) key = `_${key}`;
    return key;
};
/*
const verifyDynamic = (reference, key, options) => {
    key = calcKey(key);
    if (!options) {
        return E.fxMessageError(10009, key, 'options');
    }
    if (options['column.dynamic']) {
        const {rxColumn} = reference.props;
        if (!U.isFunction(rxColumn)) {
            return E.fxMessageError(10103, key, 'options');
        }
    }
}; */
/**
 * 专用ComplexList的错误检测函数
 * @param reference
 * @param key
 * @param grid
 */
const ensureGrid = (reference = {}, key, grid = {}) => {
    // 检查基础配置key下边有内容
    let message = Verify.verifyQuery(key, grid.query);
    // 其他验证
    if (!message) {
        message = Verify.verifyOptions(key, grid.options);
    }
    // 其他验证
    /*
    if (!message) {
        // 动态验证
        message = verifyDynamic(reference, key, grid.options);
    } */
    return message;
};

export default {
    ensureGrid
}