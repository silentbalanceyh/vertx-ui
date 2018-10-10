import Ux from "ux";
import Types from "./Types";
import Mock from "./mock";

export default {
    fnCredits: Ux.rxEdict(Types.fnCredits,
        params => Ux.ajaxGet("/api/credits", params, Mock.fnCredits),
        data => {
            if (data) {
                data.filter(item => item.hasOwnProperty('extension'))
                    .map(item => item.extension)
                    .filter(item => item.hasOwnProperty('credits'))
                    .map(item => item['credits'])
                    .forEach((creditArr, index) => data[index].children = creditArr);
            }
            return Ux.rxAssist(data, "model.credit")
        }
    ),
}