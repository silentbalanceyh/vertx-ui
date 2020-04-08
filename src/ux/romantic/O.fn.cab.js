import Eg from '../engine';
import U from 'underscore';

/**
 * ## 特殊函数「Zero」
 *
 * 配置增强读取的多义性函数。
 *
 * 1. 如果 key 传入为 undefined，则直接从 `props`中读取 `config` 变量，默认：`{}`。
 * 2. 如果 key 是字符串不带 `.` 操作符，则直接读取资源文件中的 `_<key`，内部调用 `fromHoc`（高频方式）。
 * 3. 如果 key 是字符串带 `.` 操作符，则直接将该值如：`key.xt` 转换成 `["key","xt"]`，对应 `_key -> xt` 节点。
 * 4. 如果 key 是Array，则执行 `fromPath` 方法。
 *
 * 该方法保证最终得到的值是合法的。
 *
 * @memberOf module:_romantic
 * @param {ReactComponent} reference React组件引用
 * @param {String} key 将要读取的配置的 key 值信息
 * @return {any} 返回读取到的最终信息
 */
const sexCab = (reference = {}, key) => {
    if (undefined === key) {
        /*
         * 直接返回 props 中的 config
         */
        const {config = {}} = reference.props;
        return config;
    } else if ("string" === typeof key) {
        if (0 < key.indexOf(".")) {
            /*
             * key 中包含 . 操作符
             */
            const keys = key.split('.');
            return sexCab(reference, keys);
        } else {
            /*
             * 直接读取静态文件，state中的 $hoc
             */
            const config = Eg.fromHoc(reference, key);
            return config ? config : {};
        }
    } else if (U.isArray(key)) {
        /*
         * key是数组
         */
        const config = Eg.fromPath(reference, key);
        return config ? config : {};
    } else {
        /*
         * key是对象
         */
        return U.isObject(key) ? key : {};
    }
};

export default sexCab