import Ux from 'ux';

const $opSaveLayout = (reference) => (params = {}) => {
    const ref = Ux.onReference(reference, 1);
    const {raft} = ref.state;
    console.info(raft, ref.state);
}
export default {
    $opSaveLayout
}