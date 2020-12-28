import Abs from "../../abyss";
import R from '../expression';
import mountDropdown from "./I.fn.filter.dropdown";

export default (reference, column, config) => {
    // 下拉列表处理
    if (!Abs.isEmpty(config)) {
        // 下拉处理
        const {$datum} = column;
        let datumConfig = {};
        if ("string" === typeof $datum) {
            datumConfig = R.Ant.toParsed($datum);
        } else {
            Object.assign(datumConfig, $datum);
        }
        // 选项处理
        const options = [];
        const datumData = R.Ant.toOptions(reference, {datum: datumConfig});
        datumData.forEach(each => options.push({
            label: each.label,
            value: each.value,
        }));
        // 下拉专用
        mountDropdown(reference, options, {column, config});
    } else {
        console.error(`[Err] type = DATUM 的模式要求必须配置 config，没配置 config 节点`);
    }
}