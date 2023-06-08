import {Langue, Taper} from "environment";
import {StateIn, StateOut} from "zme";

const dataCab = (cab = {}, filename) => {
    if (cab.ns && filename) {
        const fullName = cab.ns + "/" + filename;
        return Langue(fullName);
    } else return {};
}

export default {
    dataOut: (data) => Taper.fnFlush(new StateIn(data, null)),
    dataIn: (state) => new StateOut(state),
    dataCab,
}