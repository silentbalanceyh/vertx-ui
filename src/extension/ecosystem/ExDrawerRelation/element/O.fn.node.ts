import * as G6 from "@antv/g6";

G6.registerNode('ciNode', {
    draw(models) {
        const keyShape = this.drawKeyShape(models);
        this.drawIcon(models);
        // label && Util.toFront(label, group);
        console.info(models);
        return keyShape;
    },
});// @ts-ignore