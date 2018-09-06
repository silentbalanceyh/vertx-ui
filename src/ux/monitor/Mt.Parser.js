import Ux from 'ux';

const datumEnv = (reference) => {
    const envs = Ux.Env;
    const comment = Ux.fromHoc(reference, "comment");
    const data = [];
    Ux.itObject(comment, (field, value) => {
        const array = value.split(',');
        const item = {};
        item.key = field;
        item.original = array[0];
        item.current = field;
        item.value = envs[field];
        item.type = typeof item.value;
        item.support = array[2] ? array[2] : "--";
        item.comment = array[1];
        data.push(item);
    });
    return data.sort((left, right) => Ux.sorterAsc(left, right, 'current'));
};
export default {
    datumEnv,
}