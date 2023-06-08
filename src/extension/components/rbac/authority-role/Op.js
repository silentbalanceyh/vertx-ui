import Ux from 'ux';

const rxSelected = (reference) => (keys = []) => {
    const {$roles = []} = reference.state;
    if (1 === keys.length) {
        const $selected = Ux.elementUnique($roles, 'key', keys[0]);
        Ux.of(reference).in({$selected}).done();
        // reference.?etState({$selected});
    }
}
export default {
    rxSelected,
}