import __Zn from './zero.uca.dependency';
import __STX from './syntax.__.v.grammer.definition';

export default (reference, param = {}) => {
    // 1. 数据源
    const source = __Zn.aclSource(reference, param);
    // 2. 映射配置 ( kv )
    const kv = __Zn.aclMapping(reference, param, 'h');
    // 3. 初始数据（ paramView / paramVisit ）
    // const input = __aclInput(reference, param);
    // const vv = __aclArgument(input);
    // 4. 解析值
    const values = __STX.VT_MH(reference, {...param, webKv: kv});
    // 5. 生成 $keySet / $keyDefault
    const compiled = __Zn.dataKey(source, values, kv);
    // 6. 默认选中
    return __Zn.dataDFT(compiled, param);
}