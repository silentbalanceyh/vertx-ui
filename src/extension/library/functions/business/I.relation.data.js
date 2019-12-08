import Ux from 'ux';

const dataGroup = (identifier, up = [], down = []) => {
    up = Ux.clone(up);
    down = Ux.clone(down);
    const upGroup = Ux.elementGroup(up.filter(item => identifier === item['targetIdentifier']), "sourceIdentifier");
    const downGroup = Ux.elementGroup(down.filter(item => identifier === item['sourceIdentifier']), "targetIdentifier");
    const groupData = {};
    Object.keys(upGroup).forEach(identifier => {
        if (!groupData[identifier]) {
            groupData[identifier] = {};
        }
        groupData[identifier].up = upGroup[identifier];
    });
    Object.keys(downGroup).forEach(identifier => {
        if (!groupData[identifier]) {
            groupData[identifier] = {};
        }
        groupData[identifier].down = downGroup[identifier];
    });
    return groupData;
};
export default {
    dataGroup,
}