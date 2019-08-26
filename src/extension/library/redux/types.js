import Ux from 'ux';

const PREFIX = "Επέκταση μηδέν";

export default {
    /* 应用程序专用 Epic */
    epicApp: Ux.createAction(`/${PREFIX}/APP/BY/NAME`),
    epicInit: Ux.createAction(`/${PREFIX}/APP/INIT`),
    /* Category 专用 */
    epicCategory: Ux.createAction(`/${PREFIX}/CATEGORY/BY/TYPE`)
}