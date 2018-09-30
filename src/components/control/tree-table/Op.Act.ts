import Ux from "ux";
import {Cv} from "app";

const $opAddRank = (reference: any) => Ux.ai2Event(reference, (values) => {
    console.info("归类添加", values, reference.props);
    const {key} = reference.props.$datum;
    Ux.microPost(Cv.App.Modal, "/api/categories/:mid", {
        mid: key,
        $body: Ux.Uson.create(values).add("type", "model.rank").to()
    }).then(data => Ux.showDialog(reference, "edit", () => {
        // 关闭Tab页专用方法，调用fnClose
        reference.props.fnClose();
    }));
});
const $opSaveRank = (reference: any) => Ux.ai2Event(reference, (values) => {
    console.info("归类更新: ", values);
    Ux.microPut(Cv.App.Modal, "/api/categories", values)
        .then(data => Ux.showDialog(reference, "edit", () => {
            // 关闭Tab页专用方法，调用fnClose
            reference.props.fnClose();
        }));
});
const $opAddProd = (reference: any) => (record) => {
    console.info("管理项添加", record);
};
const $opSaveProd = (reference: any) => (record) => {
    console.info("管理项更新", record, reference.props);
};
const $opAddActivity = (reference: any) => (record) => {
    console.info("活动添加", record);
};
const $opSaveActivity = (reference: any) => (record) => {
    console.info("活动更新", record);
};
export default {
    Rank: {
        $opAdd: $opAddRank,
        $opSave: $opSaveRank,
    },
    Procedure: {
        $opAdd: $opAddProd,
        $opSave: $opSaveProd,
    },
    Activity: {
        $opAdd: $opAddActivity,
        $opSave: $opSaveActivity
    }
}