import moment from "moment";
// disabledDate
const propFromNow = (current) => {
    return (current && current.format("YYYY-MM-DD") < moment().format("YYYY-MM-DD"))
};
export default {
    propFromNow
}
