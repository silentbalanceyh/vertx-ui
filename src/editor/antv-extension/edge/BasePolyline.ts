import * as G6 from '@antv/g6';
import {G} from '@antv/g6/types/g';
import {CustomEdge} from '../../common/interfaces';
import Style from '../style';

const EDGE_LABEL_CLASS_NAME = 'edge-label';
const EDGE_LABEL_WRAPPER_CLASS_NAME = 'edge-label-wrapper-label';

const exPolyline: CustomEdge = {
    options: Style.OPT_LINE,

    createLabelWrapper(group: G.Group) {
        const label = group.findByClassName(EDGE_LABEL_CLASS_NAME);
        const labelWrapper = group.findByClassName(EDGE_LABEL_WRAPPER_CLASS_NAME);

        if (!label) {
            return;
        }

        if (labelWrapper) {
            return;
        }

        group.addShape('rect', {
            className: EDGE_LABEL_WRAPPER_CLASS_NAME,
            attrs: {
                fill: '#E6E6FA',
                radius: 2,
            },
        });

        label.set('zIndex', 1);

        group.sort();
    },

    updateLabelWrapper(group: G.Group) {
        const label = group.findByClassName(EDGE_LABEL_CLASS_NAME);
        const labelWrapper = group.findByClassName(EDGE_LABEL_WRAPPER_CLASS_NAME);

        if (!label) {
            labelWrapper && labelWrapper.hide();
            return;
        } else {
            labelWrapper && labelWrapper.show();
        }

        if (!labelWrapper) {
            return;
        }

        const {minX, minY, width, height} = label.getBBox();

        labelWrapper.attr({
            x: minX - 5,
            y: minY - 3,
            width: width + 10,
            height: height + 6,
        });
    },

    afterDraw(model, group) {
        this.createLabelWrapper(group);
        this.updateLabelWrapper(group);
    },

    afterUpdate(model, item) {
        const group = item.getContainer();

        this.createLabelWrapper(group);
        this.updateLabelWrapper(group);
    },

    setState(name, value, item) {
        const shape: G.Shape = item.get('keyShape');

        if (!shape) {
            return;
        }

        const {style, stateStyles} = this.options;

        const stateStyle = stateStyles[name];

        if (!stateStyle) {
            return;
        }

        if (value) {
            shape.attr({
                ...style,
                ...stateStyle,
            });
        } else {
            shape.attr(style);
        }
    },
};

G6.registerEdge('exPolyline', exPolyline, 'line');
