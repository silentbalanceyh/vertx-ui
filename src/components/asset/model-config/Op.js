import Ux from "ux";

const yiPage = (reference) => {
    const assert = Ux.fromHoc(reference, "assist");
    Ux.asyncAssist(assert, reference, {})
        .then(Ux.ready).then(Ux.pipe(reference))
}
export default {
    yiPage
}