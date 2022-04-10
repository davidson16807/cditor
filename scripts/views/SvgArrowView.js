'use strict';

function SvgArrowView(svg, svg_arrow_attributes, view_event_deferal) {
    const arrows = svg_arrow_attributes;

    const drawing = {};
    drawing.draw = function(dom, screen_frame_store, arrow, drag_type, onclick, onselect) {
        const text_width = 80;
        const g = svg.g(
            {
                class: 'arrow-group ' + (drag_type.id == 'released'?  'highlight-on-hover' : 'highlight-never'),
            },
            [
                svg.path({class:"arrow-highlight", d: arrows.path(screen_frame_store, arrow.arc)}),
                svg.circle({class:"arrow-tip-highlight", r:10}, arrows.sample(screen_frame_store, arrow.arc,0)),
                svg.circle({class:"arrow-tip-highlight", r:10}, arrows.sample(screen_frame_store, arrow.arc,1)),
                // svg.circle({class:"arrow-handle", r:13} arrows.sample(arrow.arc,0)),
                // svg.circle({class:"arrow-handle", r:13} arrows.sample(arrow.arc,1)),
                svg.path({class:"arrow", d: arrows.head(screen_frame_store, arrow.arc)}),
                svg.path({class:"arrow", d: arrows.path(screen_frame_store, arrow.arc)}),
            ]);
        const deferal = view_event_deferal(drawing, arrow, dom);
        if (onclick) {
            g.addEventListener('mousedown',  event => event.button == 0 && deferal.callbackPreventStop(onclick)(event));
        }
        if (onselect) {
            g.addEventListener('mousedown',  event => event.button == 2 && deferal.callbackPreventStop(onselect)(event));
            g.addEventListener('mouseenter', event => (!arrow.is_edited && event.buttons == 2) && deferal.callbackPreventStop(onselect)(event));
        }
        return g;
    }
    return drawing;
}
