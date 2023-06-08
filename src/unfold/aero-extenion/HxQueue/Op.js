import Ux from 'ux';
import __Zn from '../zero.aero.dependency';

export default {
    // Source to Data
    yoData: (reference, region = {}) => {
        const {config = {}, data = []} = reference.props;
        const {webSection = {}} = config;
        const {field} = webSection;
        return data
            .filter(item => region.value === item[field])
            .sort(Ux.sorterAscTFn('sort'));
    },
    componentInit: (reference) => {
        Ux.dgAdmit(reference.props, "HxQueue", true, {color: "#1C86EE"});
        const state = {};
        return __Zn.aclRegionInit(reference).then((response => {
            state.$ready = true;
            Object.assign(state, response);
            Ux.dgAdmit(state, "HxQueue", false, {color: "#1C86EE"});
            return Ux.promise(state);
        }))
    }
}