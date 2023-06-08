import Ux from "ux";
import __Zn from '../zero.aero.dependency';

const __aclSelected = (reference, source = []) => {
    const nodeArgs = __Zn.aclArgument(reference);
    // The parsed `paramView` could not be found by `uid` ( view + position )
    const {
        paramView = {},
        paramVisit
    } = nodeArgs;
    const found = Ux.elementUnique(source, 'uid', paramView.uid);
    if (paramVisit && found && found.visitant && found.visitant.hasOwnProperty(paramVisit['seekKey'])) {
        const values = found.visitant[paramVisit['seekKey']];
        const valueChange = {};
        Object.keys(values).forEach(flag => {
            if (['h', 'q', 'v'].includes(flag)) {
                valueChange[flag] = {};
                valueChange[flag].value = values[flag];
            }
        });
        const {$inited = {}} = reference.state;
        const normalized = Ux.clone($inited);
        ['h', 'q', 'v'].forEach(field => {
            if (valueChange[field] && normalized[field]) {
                normalized[field].value = valueChange[field].value;
            }
        });
        return __Zn.aclIn(reference, normalized);
    }
}
export default {
    keyFn2: (reference) => ($keySet) => {
        const {$prerequest = []} = reference.props;
        // ( 0 === length ) The parent $keyChild is empty, it means that current resource has not been set
        if (0 === $prerequest.length) {
            return $keySet;
        }
        const parsed = __aclSelected(reference, $prerequest);
        if (!parsed) {
            return $keySet;
        }
        return new Set(Array.from($keySet).filter(key => parsed.has(key)));
    }
}