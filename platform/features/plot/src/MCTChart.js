/*global define,Promise*/

/**
 * Module defining MCTChart. Created by vwoeltje on 11/12/14.
 */
define(
    ["./GLChart"],
    function (GLChart) {
        "use strict";

        var TEMPLATE = "<canvas style='position: absolute; background: none; width: 100%; height: 100%;'></canvas>";

        /**
         *
         * @constructor
         */
        function MCTChart($interval) {

            function linkChart(scope, element) {
                var canvas = element.find("canvas")[0],
                    chart = new GLChart(canvas);

                function doDraw() {
                    var draw = scope.draw;

                    canvas.width = canvas.offsetWidth;
                    canvas.height = canvas.offsetHeight;
                    chart.clear();

                    if (!draw) {
                        return;
                    }

                    chart.setDimensions(
                        draw.dimensions || [1, 1],
                        draw.origin || [0, 0]
                    );

                    (draw.lines || []).forEach(function (line) {
                        chart.drawLine(
                            line.buffer,
                            line.color,
                            line.points
                        );
                    });

                    (draw.boxes || []).forEach(function (box) {
                        chart.drawSquare(
                            box.start,
                            box.end,
                            box.color
                        );
                    });

                }

                function drawIfResized() {
                    if (canvas.width !== canvas.offsetWidth ||
                            canvas.height !== canvas.offsetHeight) {
                        doDraw();
                    }
                }

                $interval(drawIfResized, 1000);
                scope.$watchCollection("draw", doDraw);
            }

            return {
                restrict: "E",
                template: TEMPLATE,
                link: linkChart,
                scope: { draw: "=" }
            };
        }

        return MCTChart;
    }
);