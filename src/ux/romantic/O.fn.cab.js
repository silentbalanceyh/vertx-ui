import Eg from '../engine';
import U from 'underscore';

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