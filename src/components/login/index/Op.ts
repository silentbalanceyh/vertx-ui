import Ux from 'ux';

const fnLogin = Ux.rxJet().success((values: any) => {
    console.info("Login", values);
}).to();
const fnReset = Ux.rxJet().success((values: any) => {
    console.info("Reset", values);
}).to();
export default {
    fnLogin,
    fnReset
}