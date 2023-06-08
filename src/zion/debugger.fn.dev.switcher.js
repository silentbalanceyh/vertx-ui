import __Zn from "./zero.module.dependency";

const Cv = __Zn.Env;

const devSkipValidate = () => __Zn.dgSkip(__Zn.toQuery(Cv.DEV.SKIP_VALIDATE));

export default {
    devSkipValidate,
}