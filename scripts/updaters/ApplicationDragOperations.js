'use strict';

/*
`ApplicationDragOperations` returns a namespace of *conceptually* pure functions 
that describe how ApplicationState changes in response to drag operations: 
its modifications to the ModelView, its transitions in drag state, and its update to the undo/redo history
as drags are initialized, transformed, and released.
*/
function ApplicationDragOperations(
        screen_frame_storage,  
        offset_frame_shifting, 
        position_frame_shifting, 
    ) {
    const storage = screen_frame_storage;
    const offset_shifting = offset_frame_shifting;
    const position_shifting = position_frame_shifting;
    return {

        wheel: function(screen_focus, scroll_count, app_io) {
            const screen_frame_store = app_io.view.screen_frame_store;
            const screen_frame = storage.unpack(screen_frame_store);
            const model_focus = position_shifting.leave(screen_focus, screen_frame);

            app_io.drag_state = app_io.drag_type.wheel(app_io.drag_state, model_focus, scroll_count);
            app_io.drag_type.command(app_io.drag_state, false, false).forward(app_io.diagram, app_io.view);
        },

        move: function (screen_position, screen_offset, app_io) {
            const screen_frame_store = app_io.view.screen_frame_store;
            const screen_frame = storage.unpack(screen_frame_store);
            const model_position = position_shifting.leave(screen_position, screen_frame);
            const model_offset = offset_shifting.leave(screen_offset, screen_frame);

            app_io.drag_type = app_io.drag_type;
            app_io.drag_state = app_io.drag_type.move(app_io.drag_state, model_position, model_offset);

            app_io.drag_type.command(app_io.drag_state, false, false).forward(app_io.diagram, app_io.view);
        },

        transition: function(drag_type, app_io) {
            const screen_frame_store = app_io.view.screen_frame_store;

            const drag_arrow = drag_type.initialize();

            const is_released = drag_type.id == DragState.released;
            const is_canceled = drag_type.id != DragState.released && drag_type.id != app_io.drag_type.id;


            if (is_released || is_canceled) { 
                app_io.drag_type.command(app_io.drag_state, is_released, is_canceled).forward(app_io.diagram, app_io.view); 
            }

            app_io.drag_type = drag_type;
            app_io.drag_state = drag_arrow;

            if (!(is_released || is_canceled)) {
                app_io.drag_type.command(app_io.drag_state, is_released, is_canceled).forward(app_io.diagram, app_io.view);
            }
        }

    };
}
