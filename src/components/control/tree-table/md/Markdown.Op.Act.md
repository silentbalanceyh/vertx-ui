### 1.说明

该代码中包含了两个Form界面对应的函数信息，主要包含

* 三级分类表单中的提交
* 三级分类之下管理项的提交

### 2.代码

```typescript
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
    export default {
        Rank: {
            $opAdd: $opAddRank,
            $opSave: $opSaveRank,
        },
        Procedure: {
            $opAdd: $opAddProd,
            $opSave: $opSaveProd,
        }
    }
```