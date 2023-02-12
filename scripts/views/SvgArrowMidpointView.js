'use strict';

function SvgArrowMidpointView(dependencies, settings) {
    const point_arcs_and_sampler_arcs  = dependencies.point_arcs_and_sampler_arcs;
    const stored_arcs_and_point_arcs_curried = dependencies.stored_arcs_and_point_arcs_curried;
    const PanZoomMapping = dependencies.PanZoomMapping;
    const svg = dependencies.svg;
    const svg_arrow_attributes = dependencies.svg_arrow_attributes;
    const sampler_arc_properties = dependencies.sampler_arc_properties;
    const sampler_arc_resizing = dependencies.sampler_arc_resizing;
    const sampler_arc_transforms = dependencies.sampler_arc_transforms;
    const view_event_deferal = dependencies.view_event_deferal;
    const screen_state_storage = dependencies.screen_state_storage;

    const source_trim_length = settings.source_trim_length;
    const target_trim_length = settings.target_trim_length;
    const midpoint_width     = settings.midpoint_width;

    const drawing = {};
    drawing.draw = function(dom, screen_state_store, arrow, arrows, drag_type, onclick, onenter, onleave) {
        const screen_frame = screen_state_storage.unpack(screen_state_store);
        const screen_mapping = PanZoomMapping(screen_frame);
        const screen_midpoint_width = screen_mapping.distance.apply(midpoint_width);
        const stored_arcs_and_point_arcs = stored_arcs_and_point_arcs_curried(arrows);
        const point_arc = stored_arcs_and_point_arcs.stored_arc_to_point_arc(arrow.arc);
        const sampler_arc = point_arcs_and_sampler_arcs.point_arc_to_sampler_arc(point_arc);
        const trimmed_arc = sampler_arc_transforms.trim(sampler_arc, source_trim_length, -target_trim_length);
        const screen_arc = SamplerArcMapping(screen_mapping).apply(trimmed_arc);

        const g = svg.g(
            {
                class: (drag_type.id == 'released'?  'highlight-on-hover' : 'highlight-never'),
            },
            [
                svg.circle(
                    {
                        class: "object-highlight", 
                        r: screen_midpoint_width/2.0
                    }, 
                    sampler_arc_properties.position(screen_arc, 0.5)
                ),
            ]);
        const deferal = view_event_deferal(drawing, arrow, dom);
        if (onclick != null) {
            g.addEventListener('mousedown',  deferal.callbackPrevent(onclick));
            g.addEventListener('touchstart', deferal.callbackPrevent(onclick));
        }
        if (onenter != null) {
            g.addEventListener('mousedown', deferal.callbackPrevent(onenter));
            g.addEventListener('mouseover', deferal.callbackPrevent(onenter));
        }
        if (onleave != null) {
            g.addEventListener('mouseout', deferal.callbackPrevent(onleave));
        }
        return g;
    }
    return drawing;
}
