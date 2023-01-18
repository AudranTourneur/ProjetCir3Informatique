import Konva from 'konva/lib/Core';
// Now you have a Konva object with Stage, Layer, FastLayer, Group, Shape and some additional utils function.
// Also core currently already have support for drag&drop and animations.
// BUT there are no shapes (rect, circle, etc), no filters.

// but you can simply add anything you need:
import { Rect } from 'konva/lib/shapes/Rect';
import { Circle } from 'konva/lib/shapes/Circle';
import { Image } from 'konva/lib/shapes/Image';
// importing a shape will automatically inject it into Konva object


// for filters you can use this:
import { Blur } from 'konva/lib/filters/Blur';

export function initKonva() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    var stage = new Konva.Stage({
        container: 'container-konva',
        width: width,
        height: height,
    });

    var layer = new Konva.Layer();
    stage.add(layer);

    var circle = new Circle({
        x: stage.width() / 2,
        y: stage.height() / 2,
        radius: 50,
        fill: 'green',
        zIndex: 2,
    });
    layer.add(circle);

    var scaleBy = 1.01;
    stage.on('wheel', (e) => {
        // stop default scrolling
        e.evt.preventDefault();

        var oldScale = stage.scaleX();
        var pointer = stage.getPointerPosition();

        var mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        // how to scale? Zoom in? Or zoom out?
        let direction = e.evt.deltaY > 0 ? 1 : -1;

        // when we zoom on trackpad, e.evt.ctrlKey is true
        // in that case lets revert direction
        if (e.evt.ctrlKey) {
            direction = -direction;
        }

        var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        stage.scale({ x: newScale, y: newScale });

        var newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        stage.position(newPos);

        // alternative API:

    });

    Image.fromURL('/Etage_2_clean.png', function (darthNode) {
        darthNode.setAttrs({
            x: 200,
            y: 50,
            scaleX: 0.5,
            scaleY: 0.5,
            cornerRadius: 20,
            zIndex: 1,
        });
        darthNode.zIndex(5)
        layer.add(darthNode);
    });


}