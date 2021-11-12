import Ux from 'ux';
import Ex from 'ex';

export default {
    yoConfiguration: (reference, workflow = {}) => {
        const inherits = Ex.yoAmbient(reference);
        const {parameter = {}} = workflow;
        // code only
        inherits.$workflow = Ux.clone(parameter);
        const {$workflow = {}} = reference.state;
        // definitionId ( Critical )
        inherits.$workflow.definitionId = $workflow.definitionId;
        return inherits;
    },
    yoOp: (reference) => ({
        rxCriteria: () => (event) => {

        },
        rxWorkflow: () => () => {
            const {$workflow = {}} = reference.state;
            if (Ux.isNotEmpty($workflow)) {
                reference.setState({$visibleHelp: true});
            }
        }
    })
}