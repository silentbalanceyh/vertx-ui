export default {
    field: (reference, jsx) => {
        const {$inited = {}} = reference.props;
        const {render = {}} = $inited;
        if (["aiTitle", "aiMagic"].includes(render.key)) {
            jsx.disabled = true;
        }
    }
}