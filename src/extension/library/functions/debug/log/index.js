import Ux from 'ux';

const tab = (object, isOuter = true) => {
    const label = isOuter ? "[ExTab] 传入信息 -->" : "[ExTab] --> 传入信息";
    Ux.dgDebug(object, label, "#369")
};
const list = (object, isOuter = true) => {
    const label = isOuter ? "[ExComplexList] 传入信息 -->" : "[ExComplexList] --> 传入信息";
    Ux.dgDebug(object, label);
};
export default {
    tab,
    list
}