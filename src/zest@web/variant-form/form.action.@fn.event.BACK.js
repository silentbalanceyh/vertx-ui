import __Zn from "./zero.form.dependency";

const Cv = __Zn.Env;
export default (reference) => (event) => {
    __Zn.prevent(event);
    __Zn.toOriginal(reference, null, [Cv.K_ARG.TID]);
}