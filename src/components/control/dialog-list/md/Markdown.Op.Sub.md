### 1.说明

参考`Op.ts`的文档。

### 2.代码

```typescript
    import Ux from 'ux';

    const $opSubSave = (reference: any) => Ux.ai2Event(reference,
        (values) => {
            Ux.closeWindow(reference);
        });
    /**
     * @param reference
     */
    const $opSubAdd = (reference: any) => Ux.ai2Event(reference,
        (values) => {
            Ux.closeWindow(reference);
        });
    export default {
        $opSubSave,
        $opSubAdd
    }
```