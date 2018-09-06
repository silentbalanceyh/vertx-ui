import Ux from 'ux';

const datumEnv = (reference) => {
    const envs = Ux.Env;
    const comment = Ux.fromHoc(reference, "comment");
    console.info(envs, comment);
};
export default {
    datumEnv,
}