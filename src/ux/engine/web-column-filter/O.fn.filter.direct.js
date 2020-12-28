import Value from "../../abyss";
import R from '../expression';
import mountDropdown from './I.fn.filter.dropdown';

export default (reference, column, config) => {
    if (!Value.isEmpty(config)) {
        // 下拉处理
        const options = [];
        // 直接解析 datum
        // 也会得到 key, label, value
        const datum = R.Ant.toOptions(reference, config);
        datum.forEach(each => options.push({
            label: each.label,
            value: each.value
        }));
        // 下拉专用
        mountDropdown(reference, options, {column, config});
    } else {
        console.error(`[Err] type = DIRECT 的模式要求必须配置 config，没配置 config 节点`);
    }
};