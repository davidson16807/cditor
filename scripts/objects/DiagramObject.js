'use strict';

/*
`DiagramObject` is a data structure that represents every property of an object that can be depicted within the application.
*/
class DiagramObject {
    constructor(position, depiction, annotation, is_edited){
        this.position = position;
        this.depiction = depiction || '\\( \\bullet \\)';
        this.annotation = annotation || '';
        this.is_edited = is_edited || false;
    }
    copy(){
        return new DiagramObject(this.position, this.depiction, this.annotation, this.is_edited);
    }
}
