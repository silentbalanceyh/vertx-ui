import Ux from 'ux';

const buildView = (views) => {
    if (Ux.isArray(views)) {
        let $views = [];
        views.forEach(view => {
            const each = buildView(view);
            $views = $views.concat(each);
        })
        return $views;
    } else {

        // S_VIEW data
        const viewProc = {};
        const {
            visitant = {},
            ...rest
        } = views;
        Object.assign(viewProc, rest);

        // S_VISITANT data = ( seekKey = visitant )
        const visitantArr = [];
        Object.keys(visitant).forEach(seekKey => {
            const visitantData = {};
            const {
                h: dmRow,           // h -> dmRow
                q: dmQr,            // q -> dmQr
                v: dmColumn,        // v -> dmColumn
                ...restVisit
            } = visitant[seekKey];
            Object.assign(visitantData, restVisit, {dmRow, dmQr, dmColumn});
            visitantArr.push(Ux.valueValid(visitantData));
        });
        viewProc.visitant = visitantArr;
        return viewProc;
    }
}
export default (reference, param = {}) => {
    // Multi Resource Processing
    const resource = {}
    const {webSelected = {}} = param;
    /*
     * webSelected =
     * {
     *     resource:
     *         position:
     *         uid:
     *         view:
     *         visitant:
     *             key ( workflow / position / view ):
     *                 h: {
     *                     key: []
     *                 },
     *                 identifier,
     *                 mode,
     *                 phase,
     *                 seekKey,
     *                 type
     * }
     */
    Object.keys(webSelected).forEach(resourceKey => {
        // S_RESOURCE -> views = [view1, view2]
        const views = webSelected[resourceKey];
        resource[resourceKey] = buildView(views);
    });
    return resource;
}