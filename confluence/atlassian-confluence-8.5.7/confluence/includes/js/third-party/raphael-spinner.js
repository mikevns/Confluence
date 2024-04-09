/*eslint @atlassian/confluence-server/must-use-amd:0, aui-deprecation/no-raphael:0*/
var Raphael = Raphael || {};

/**
 * Legacy spinner implementation. Previously implemented using Raphael and thus namespaced as an extension of that
 * library. Raphael has now been removed and this code delegates to the AUI spinner instead.
 *
 * @param holderId an element id or DOM element or jQuery object
 * @param radius the outer radius size of the spinner
 * @param colour the spinner color
 * @returns {Function} invoke this function to remove the spinner
 * @deprecated since 5.7, use AUI spinner instead https://docs.atlassian.com/aui/latest/docs/spinner.html
 */
Raphael.spinner = function (holderId, radius, colour) {
    var color = colour || "#fff";
    var lineThickness = radius * 13 / 60;
    var innerRadius = radius * 30 / 60;
    var lineLength = radius - innerRadius;

    var opts = {
        color: color,
        width: lineThickness,
        radius: innerRadius,
        length: lineLength,
        top: 0,
        left: 0,
        zIndex: 0,
        speed: 1.042
    };

    var $target = $(holderId);
    $target.spin(opts);

    return function () {
        $target.spinStop();
    };
};

Raphael.spinner = AJS.deprecate.fn(Raphael.spinner, 'Raphael spinner', {alternativeName: 'aui-spinner'});
