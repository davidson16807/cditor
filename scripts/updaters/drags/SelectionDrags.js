'use strict';

function SelectionDrags( 
        arrow_positions_resource, 
        object_position_resource,
        position_map_operations){
    return {
        move: function(initial_arrows, arrow_selections, initial_objects, object_selections) {
            return {
                id: DragState.object,
                is_model_drag: true,
                is_view_drag: false,
                initialize: () => {
                    const cell_positions = 
                        position_map_operations.update(
                            arrow_positions_resource.get(arrow_selections),
                            object_position_resource.get(object_selections),
                        );
                    return cell_positions;
                },
                move: (cell_positions, model_position, model_offset) => 
                    position_map_operations.offset(cell_positions, model_offset),
                wheel: (cell_positions, screen_focus, scroll_count) => cell_positions,
                // delete the object and its arrows if canceled, otherwise move the object and its arrows
                command: (cell_positions, is_released, is_canceled) => {
                    return is_canceled?
                        new Command(
                          // forward
                          (model_io, view_io) => {
                            model_io.arrows = arrow_positions_resource.delete(initial_arrows, cell_positions);
                            model_io.objects = object_position_resource.delete(initial_objects, cell_positions);
                            view_io.arrow_selections = [];
                            view_io.object_selections = [];
                          },
                          // backward
                          (model_io, view_io) => {
                            model_io.arrows = initial_arrows;
                            model_io.objects = initial_objects;
                            view_io.arrow_selections = arrow_selections;
                            view_io.object_selections = object_selections;
                          },
                        )
                      : new Command(
                          // forward
                          (model_io, view_io) => {
                            model_io.arrows = arrow_positions_resource.put(initial_arrows, cell_positions, !(is_released));
                            model_io.objects = object_position_resource.put(initial_objects, cell_positions, !(is_released));
                            view_io.arrow_selections = arrow_positions_resource.put(arrow_selections, cell_positions, !(is_released));
                            view_io.object_selections = object_position_resource.put(object_selections, cell_positions, !(is_released));
                          },
                          // backward
                          (model_io, view_io) => {
                            model_io.arrows = initial_arrows;
                            model_io.objects = initial_objects;
                            view_io.arrow_selections = arrow_selections;
                            view_io.object_selections = object_selections;
                          },
                        )
                }
            };
        },
    };
}
