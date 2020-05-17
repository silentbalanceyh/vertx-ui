import E from "../../error";
import Abs from '../../abyss';
import Ele from '../../element';

/**
 * ## 引擎函数
 *
 * 资源文件数据读取专用方法，从 $hoc 中读取主键值相关信息。
 *
 * @memberOf module:_from
 * @param {ReactComponent} reference React对应组件引用。
 * @param {String} key 读取对应属性名。
 * @return {null}
 */
const fromHoc = (reference = {}, key = "") => {
    E.fxTerminal("string" !== typeof key, 10000, "string", typeof key);
    if (reference) {
        const {$hoc} = reference.state;
        return ($hoc) ? $hoc._(key) : null;
    } else {
        console.error("传入第一个参数 reference 为 null 或 undefined");
    }
};
/**
 * ## 引擎函数
 *
 * 资源文件数据读取专用方法，从 $hoc 中读取主键值相关信息，可以处理深度路径信息。
 *
 * @memberOf module:_from
 * @param {ReactComponent} reference React对应组件引用。
 * @param {String[]} args 读取属性名核心路径。
 * @return {null}
 */
const fromPath = (reference = {}, ...args) => {
    let keys = Ele.ambArray.apply(this, args);
    const length = keys['length'];
    E.fxTerminal(1 > length, 10070, keys, 1);
    let data = fromHoc(reference, keys[0]);
    if (1 < length && data) {
        const path = [];
        [].concat(keys).forEach((item, index) => {
            if (0 < index) {
                path.push(item);
            }
        });
        const $data = Abs.immutable(data);
        data = $data.getIn(path);
        if (data && data.toJS) {
            data = data.toJS();
        }
    }
    return data;
};
export default {
    fromHoc,
    fromPath,
}