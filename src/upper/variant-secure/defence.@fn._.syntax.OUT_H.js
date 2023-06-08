import __Zn from './zero.uca.dependency';

export default (reference, param = {}) => {
    // 1. 数据源
    const source = __Zn.aclSource(reference, param);
    // 2. 映射配置 ( kv )
    const kv = __Zn.aclMapping(reference, param, 'h');
    // 3. 初始数据（ paramView / paramVisit ）
    const input = __Zn.aclInput(reference, param);
    const vv = __Zn.aclArgument(input);
    // 4. 生成 values
    const request = {};
    request[kv.to] = __Zn.dataValue(source, param, kv);
    // 5. 标准化请求
    return __Zn.dataRequest({
        h: request
    }, vv);
}