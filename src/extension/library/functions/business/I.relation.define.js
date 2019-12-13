import Dt from './I.relation.data';

const dataGroup = (identifier, up = [], down = [], idMap = []) => {
    const groupedData = Dt.dataGroup(identifier, up, down);
    const groupedDefine = {};
    idMap.forEach(identifier => groupedDefine[identifier] = {up: [], down: []});
    Object.assign(groupedDefine, groupedData);
    return groupedDefine;
};
export default {

    dataGroup,
}