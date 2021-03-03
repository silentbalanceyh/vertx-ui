import Ux from "ux";


const yiPage = (reference) => {
    const state = {};
    const card = Ux.fromHoc(reference, "card");
    if (card.extra) {
        state.$extra = Ux.clone(card.extra);
    }
    Ux.promise(state)
        .then(Ux.ready).then(Ux.pipe(reference))
}
export default {
    yiPage,
}