import Ux from "ux";
import {TxPhase} from '../aero-extenion';
import __CFG from './workflow.__.fn.config.norm';

export default (reference) => (inherit = {}) => {
    const $workflow = Ux.ambValue(reference, "$workflow");
    const config = __CFG.configUi($workflow, "phase");
    const {data = {}} = inherit;
    return (
        <TxPhase config={config} value={data.phase}/>
    )
}