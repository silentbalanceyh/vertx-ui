export default (params = []) => async (dataEvent) => {
    const input = dataEvent.getPrev();
    const data = dataEvent.getData();
    let field = params[0] ? params[0] : "key";
    return data.filter(item => input.includes(item[field]));
}