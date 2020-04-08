import {CustomNode, NodeModel} from "../../common/interfaces";
import {ItemState} from "../../common/constants";
import * as G6 from "@antv/g6";
import * as merge from "lodash/merge";
import {G} from "@antv/g6/types/g";
import {optimizeMultilineText} from "../../shape/utils";
import * as isArray from "lodash/isArray";
import Style from '../style';

const WRAPPER_BORDER_WIDTH = 2;
const WRAPPER_HORIZONTAL_PADDING = 10;

const WRAPPER_CLASS_NAME = 'node-wrapper';
const CONTENT_CLASS_NAME = 'node-content';
const LABEL_CLASS_NAME = 'node-label';

const exBaseNode: CustomNode = {
    /* 默认风格修改 */
    options: Style.OPT_RECT,

    getOptions(model: NodeModel) {
        const style = model.data.contentStyle ? model.data.contentStyle : {};
        return merge({}, this.options, this.getCustomConfig(model) || {}, model, {contentStyle: style});
    },

    draw(model, group) {
        const keyShape = this.drawWrapper(model, group);

        this.drawContent(model, group);
        this.drawLabel(model, group);
        this.drawIcon(model, group);

        return keyShape;
    },

    drawIcon(model, group) {
        if (model.icon) {
            group.addShape('image', {
                attrs: {
                    x: 14,
                    y: 3,
                    width: 52,
                    height: 52,
                    img: model.icon
                }
            })
        }
    },

    drawWrapper(model: NodeModel, group: G.Group) {
        const [width, height] = this.getSize(model);
        const {wrapperStyle} = this.getOptions(model);
        const config: any = {
            className: WRAPPER_CLASS_NAME,
            attrs: {
                x: 0,
                y: -WRAPPER_BORDER_WIDTH * 2,
                width,
                height: height + WRAPPER_BORDER_WIDTH * 2,
                ...wrapperStyle,
            }
        };
        return group.addShape('rect', config);
    },

    drawContent(model: NodeModel, group: G.Group) {
        const [width, height] = this.getSize(model);
        const {contentStyle} = this.getOptions(model);
        const config: any = {
            className: CONTENT_CLASS_NAME,
            attrs: {
                x: 0,
                y: 0,
                width,
                height,
                ...contentStyle,
            },
        };
        return group.addShape('rect', config);
    },

    drawLabel(model: NodeModel, group: G.Group) {
        const [width, height] = this.getSize(model);
        const {labelStyle} = this.getOptions(model);
        let y;
        if (model.icon) {
            y = height / 5 * 4 + 3;
        } else {
            y = height / 2;
        }
        let label = model.label;
        if (model._counter) {
            label += model._counter;
        }
        return group.addShape('text', {
            className: LABEL_CLASS_NAME,
            attrs: {
                x: width / 2,
                y,
                text: label,
                ...labelStyle,
            },
        });
    },

    setLabelText(model: NodeModel, group: G.Group) {
        const shape = group.findByClassName(LABEL_CLASS_NAME);

        if (!shape) {
            return;
        }

        const [width] = this.getSize(model);
        const {fontStyle, fontWeight, fontSize, fontFamily} = shape.attr();

        const text = model.label;
        const font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;

        shape.attr('text', optimizeMultilineText(text, font, 2, width - WRAPPER_HORIZONTAL_PADDING * 2));
    },

    update(model, item) {
        const group = item.getContainer();

        this.setLabelText(model, group);
    },

    setState(name, value, item) {
        if (this.beforeSetState) {
            this.beforeSetState(name, value, item);
        }

        const group = item.getContainer();
        const model = item.getModel();
        const states = item.getStates() as ItemState[];

        [WRAPPER_CLASS_NAME, CONTENT_CLASS_NAME, LABEL_CLASS_NAME].forEach(className => {
            const shape = group.findByClassName(className);
            const options = this.getOptions(model);

            const shapeName = className.split('-')[1];

            shape.attr({
                ...options[`${shapeName}Style`],
            });

            states.forEach(state => {
                if (options.stateStyles[state] && options.stateStyles[state][`${shapeName}Style`]) {
                    shape.attr({
                        ...options.stateStyles[state][`${shapeName}Style`],
                    });
                }
            });
        });

        if (name === ItemState.Selected) {
            const wrapperShape = group.findByClassName(WRAPPER_CLASS_NAME);

            const [width, height] = this.getSize(model);

            if (value) {
                wrapperShape.attr({
                    x: -WRAPPER_BORDER_WIDTH,
                    y: -WRAPPER_BORDER_WIDTH * 2,
                    width: width + WRAPPER_BORDER_WIDTH * 2,
                    height: height + WRAPPER_BORDER_WIDTH * 3,
                });
            } else {
                wrapperShape.attr({
                    x: 0,
                    y: -WRAPPER_BORDER_WIDTH * 2,
                    width,
                    height: height + WRAPPER_BORDER_WIDTH * 2,
                });
            }
        }
    },

    getSize(model: NodeModel) {
        const {size} = this.getOptions(model);

        if (!isArray(size)) {
            return [size, size];
        }

        return size;
    },

    getAnchorPoints() {
        return [
            [0, 0.5],
            [1, 0.5],
            [0.5, 0],
            [0.5, 1],
        ];
    },
};

G6.registerNode('exBaseNode', exBaseNode);