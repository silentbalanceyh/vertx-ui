import { DataLabor } from "entity";

const writeTree = (reference = {}, state) => {
    const {fnOut} = reference.props;
    if (fnOut) {
        fnOut(DataLabor.createIn(state, null));
    } else {
        console.warn("[STATE] 'fnOut' function is missing in current component.", reference);
    }
};
export default {
    writeTree
}
