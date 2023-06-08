import __Zn from './zero.uca.dependency';
import __STX from './syntax.__.v.grammer.definition';
import __DATA from '../rbac.__.fn.data.execute';

export default (reference, param = {}) => {// 1. 数据源
    const source = __Zn.aclSource(reference, param);
    // 2. 映射配置 ( kv )
    const kv = __Zn.aclMapping(reference, param, 'h');
    // 3. 初始数据（ paramView / paramVisit ）
    const input = __Zn.aclInput(reference, param);
    const vv = __Zn.aclArgument(input);
    const {paramVisit = {}} = vv;
    const values = __STX.VT_SH(reference, {
        ...param, webKv: kv,
        keyVisit: paramVisit['seekKey']     // Filter
    });
    // 5. 生成 $keySet / $keyDefault
    const compiled = __DATA.dataKey(source, values, kv);
    return __Zn.dataDFT(compiled, param);
}