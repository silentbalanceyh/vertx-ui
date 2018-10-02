import Ux from 'ux';

const $opAdd = (reference: any) => Ux.ai2Event(reference,
    (values) => {
        console.info(values, reference.props);
    });
const $opSave = (reference: any) => Ux.ai2Event(reference,
    (values) => {
        console.info(values);
    });
export default {
    $opAdd,
    $opSave,
}