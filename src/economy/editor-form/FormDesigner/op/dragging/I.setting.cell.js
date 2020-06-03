import Ux from 'ux';

export default {
    field: (reference, jsx) => {
        const {$inited = {}} = reference.props;
        const {render = {}} = $inited;
        const PREVENT = Ux.immutable(["aiTitle", "aiMagic"]);
        if (PREVENT.contains(render.key)) {
            jsx.disabled = true;
        }
    }
}