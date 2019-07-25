import Ux from 'ux';

const PREFIX = "Επέκταση μηδέν";

export default {
    epicApp: Ux.createAction(`/${PREFIX}/APP/BY/NAME`),
    epicInit: Ux.createAction(`/${PREFIX}/APP/INIT`),
}