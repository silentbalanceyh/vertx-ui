export default (params = []) => async (dataEvent) => {
    const data = dataEvent.getData();
    const input = dataEvent.getPrev();
    let field = params[0] ? params[0] : "key"; // 按主键过滤
    return data.filter(item => input === item[field]);
}