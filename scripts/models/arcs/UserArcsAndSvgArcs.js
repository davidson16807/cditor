'use strict';

/*
`UserArcsAndSvgArcs` returns a namespace of pure functions describing a small category mapping arcs to svg depictions
*/
function UserArcsAndSvgArcs(arc_geometry){
    const pi = Math.PI;
    const sqrt = Math.sqrt;
    const max = Math.max;
    const abs = Math.abs;

    return {
        user_arc_to_svg_arc: function(arc){
            const min_length = abs(arc.min_length_clockwise);
            const length = max(min_length, glm.distance(arc.source, arc.target));
            const radius = arc_geometry.radius(arc.source, arc.target, arc.min_length_clockwise);
            return new SvgArc(arc.source, arc.target, 
                radius, abs(arc.min_length_clockwise)/radius > pi, !arc.is_clockwise);
        },
        svg_arc_to_path: function(arc){
            return `M ${arc.source.x} ${arc.source.y} A ${arc.radius} ${arc.radius} 0 ${arc.is_large_arc?1:0} ${arc.is_clockwise?0:1} ${arc.target.x} ${arc.target.y}` ;
        },
    }
}
