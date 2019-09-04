import U from "underscore";

const ambiguityArray = (...args) => {
    let ref = null;
    if (1 === args.length && U.isArray(args[0])) {
        ref = args[0];
    } else {
        if (U.isArray(args)) {
            ref = args;
        } else {
            ref = [args];
        }
    }
    return ref;
};
/*
 * 二义性遍历
 */
const _itObject = (object = {}, fnKv) => {
    const ref = object;
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            const item = object[key];
            ref[key] = ambiguityKv(item, fnKv);
        }
    }
    return ref;
};

const _itArray = (array = [], fnKv) => {
    const result = [];
    array.forEach((each, index) => result[index] = ambiguityKv(each, fnKv));
    return result;
};
const ambiguityKv = (input, fnKv) => {
    /*
     * 先判断 Array，因为 Array 调用 isObject 也是 true
     */
    if (U.isArray(input)) {
        // 如果 $config 是一个 []
        return _itArray(input, fnKv);
    } else if (U.isObject(input)) {
        return _itObject(input, fnKv);
    } else {
        return fnKv(input);
    }
};
export default {
    /*
     * 二义性处理，最终转换成数组
     * 1.变参第一个参数是数组，则转换成数组
     * 2.传入的参数就是数组，则直接转换成数组
     * 3.传入其他的非数组，则直接加上 [] 转换成数组
     */
    ambiguityArray,
    /*
     * 二义性遍历，直接提取最终的 key = value
     * 1.如果是 Object，遍历每一对 key = value
     * 2.如果是 Array，先遍历每一个元素，然后 key = value（也就是每个元素中的 key = value）
     * 3.如果 Array 和 Object 相互包含，则递归
     */
    ambiguityKv,
}