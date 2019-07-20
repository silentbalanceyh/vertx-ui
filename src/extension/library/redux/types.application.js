import Ux from 'ux';

const PREFIX = "Επέκταση μηδέν";

export default {
    fnExApp: Ux.createAction(`/${PREFIX}/APP/BY/NAME`),
    fnExInit: Ux.createAction(`/${PREFIX}/APP/INIT`),
}