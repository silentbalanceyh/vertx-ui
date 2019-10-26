import E from "../../error";
import {Dsl} from 'entity';
import Abs from '../../abyss';
import Ele from '../../element';

/**
 * 资源文件数据读取方法
 * @method fromHoc
 * @param reference React对应组件引用 React.PureComponent
 * @param {String} key 读取对应属性名
 * @return {null}
 */
const fromHoc = (reference = {}, key = "") => {
    E.fxTerminal("string" !== typeof key, 10000, "string", typeof key);
    const {$hoc} = reference.state;
    return ($hoc) ? $hoc._(key) : null;
};

const fromDatum = (reference, key) => {
    key = key.replace(/\./g, "_");
    if (reference.props) {
        const targetKey =
            reference.props[`$t_${key}`] || reference.props[`$a_${key}`];
        if (targetKey) {
            if (targetKey.is()) {
                return targetKey;
            } else {
                return targetKey;
            }
        }
    }
    return Dsl.getArray(undefined);
};
/**
 * 直接从Hoc资源路径读取数据信息
 * @method fromPath
 * @param reference
 * @param args
 */
const fromPath = (reference = {}, ...args) => {
    let keys = Ele.ambiguityArray.apply(this, args);
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
    fromDatum,
    fromPath,
}