import onRelationIdentifiers from './I.fn.relation.calculator';
import onRelationType from './I.fn.type.calculator';
import DT from './I.relation.data';
import DD from './I.relation.define';

const onRelation = (current = {}, config = {}, $defineMap) => {
    const {up = [], down = []} = config;
    if ($defineMap) {
        /*
         * 定义分组
         */
        return DD.dataGroup(current.identifier, up, down, $defineMap);
    } else {
        /*
         * 数据分组
         */
        return DT.dataGroup(current.identifier, up, down);
    }
};
export default {
    onRelation,
    onRelationIdentifiers,
    onRelationType,
}