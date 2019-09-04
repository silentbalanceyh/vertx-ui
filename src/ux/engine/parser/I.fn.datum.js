import Datum from '../datum';
/*
 * 具有二义性的解析
 *
 */
export default (datum, {props}) => {
    if (datum.source) {
        const keys = Object.keys(datum).length;
        if (1 === keys) {
            /*
             * 只有 source
             */
            return Datum.elementFindDatum({props}, datum.source, {});
        } else {
            /*
             * 包含第二条件
             */
        }
    } else return null;
}