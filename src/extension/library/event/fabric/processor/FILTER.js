import Ux from 'ux';

export default {
    EQ: (params = []) => async (dataEvent) => {
        const data = dataEvent.getData();
        const input = dataEvent.getPrev();
        let field = params[0] ? params[0] : "key"; // 按主键过滤
        return data.filter(item => input === item[field]);
    },
    IN: (params = []) => async (dataEvent) => {
        const input = dataEvent.getPrev();
        const data = dataEvent.getData();
        let field = params[0] ? params[0] : "key";
        const $input = Ux.immutable(input);
        return data.filter(item => $input.contains(item[field]));
    }
}