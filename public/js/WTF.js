(function ($, kendo) {

    var dependecies = [
        "/js/WTF.Game.js",
        "/js/WTF.Game.Object.js",
        "/js/WTF.Game.Player.js",
        "/js/WTF.Abilities.js",
        "/js/WTF.Elements.js",
        "/js/WTF.Effects.js",
        "/js/WTF.Notifications.js",
        "/js/WTF.Behaviors.js",
        "/js/WTF.TeamSelector.js",
    ];

    var WTF = {
        debug: false,
        game: null,
        stage: null,
        panels: {},
        selection: null,
        markStyle: {
            selection: {
                "border": "2px solid navy"
            },
            target: {
                "border": "2px solid black"
            },
            unselected: {
                "border": "2px transparent"
            }
        },
        objects: [],
        players: {
            team: [],
            enemy: []
        },
        find: function (id) {
            var i = WTF.objects.findIndex(function (element) {
                return element.id === id;
            });
            return WTF.objects[i];
        },
        distance: function (p1, p2) {
            var distance = Math.hypot(p2.left - p1.left, p2.top - p1.top);
            return distance;
        },
        getPositions: function (o) {
            var pos = {
                left: parseInt(o.element.css("left")),
                top: parseInt(o.element.css("top"))
            };
            return [[pos.left, pos.left + o.width], [pos.top, pos.top + o.height]];
        },
        comparePositions: function (p1, p2) {
            var r1, r2;
            r1 = p1[0] < p2[0] ? p1 : p2;
            r2 = p1[0] < p2[0] ? p2 : p1;
            return r1[1] > r2[0] || r1[0] === r2[0];
        },
        overlaps: function (a, b) {
            var pos1 = this.getPositions(a),
                pos2 = this.getPositions(b);
            return this.comparePositions(pos1[0], pos2[0]) && this.comparePositions(pos1[1], pos2[1]);
        },
        randomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
        collisions: function (p) {
            if (!p.element)
                return [];
            var ranged = this.objects.filter(function (e) {
                if (!e.element)
                    return false;
                return WTF.overlaps(p, e);
            });
            return ranged;
        },
        isInRange(point, range) {
            var ranged = this.objects.filter(function (e) {
                return WTF.distance(point, e.position()) < range;
            });
            return ranged;
        }
    };

    WTF.Abilities = {};

    WTF.Elements = {};

    WTF.Effects = {};

    WTF.Notifications = {};

    WTF.Behaviors = {};

    $.extend(window, {
        WTF: WTF
    });
    
    $.getScript("/js/WTF.Loader.js", function () {
        new WTF.Loader(dependecies).load().then(function () {
            $(WTF).trigger("gameready");
        });
    });
})(jQuery, kendo);