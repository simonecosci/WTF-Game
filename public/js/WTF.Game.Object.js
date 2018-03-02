WTF.Game.Object = kendo.Class.extend({
    init: function (options) {
        this.defaults = {
            width: 0,
            height: 0,
            image: null,
            top: "auto",
            left: "auto",
            right: "auto",
            bottom: "auto",
            position: "absolute",
            selectable: false,
        };
        this.options = $.extend(true, this.defaults, options);
        this.height = this.options.height;
        this.width = this.options.width;
        this.speed = options.speed || 0;
        this.id = kendo.guid();
        var element = $("<div/>");
        element.attr("id", this.id);

        var css = {
            top: this.options.top,
            left: this.options.left,
            right: this.options.right,
            bottom: this.options.bottom,
            position: this.options.position,
            width: this.options.width,
            height: this.options.height,
            display: "none"
        };
        if (this.options.image) {
            css.backgroundImage = "url(" + this.options.image + ")";
            css.backgroundSize = "100%";
        }

        element.css(css);
        WTF.stage.append(element);
        this.element = element;
        this.element.on("dragstart", function (e) {
            e.preventDefault();
        });
        WTF.objects.push(this);
    },
    coords: function() {
        return {
            left: parseInt(this.element.css("left")),
            top: parseInt(this.element.css("top"))
        }
    },
    position: function (position) {
        var self = this;
        if (position) {
            if (position.top) {
                self.element.css({
                    top: position.top - parseInt(self.height / 2)
                })
            }
            if (position.left) {
                self.element.css({
                    left: position.left - parseInt(self.width / 2)
                })
            }
            return self;
        }
        return {
            left: parseInt(self.element.css("left")) + parseInt(self.width / 2),
            top: parseInt(self.element.css("top")) + parseInt(self.height / 2)
        }
    },
    moveTo: function (position, options) {
        var self = this;
        var duration = self.timeNeeded(position);
        var base = {
            duration: duration,
            queue: false,
            easing: "linear",
            step: function () {
                WTF.objects.forEach(element => {
                    if (WTF.overlaps(self, element)) {
                        self.element.trigger("hit", element);
                    }
                });
            }
        }
        var options = $.extend(true, base, options);
        return self.element.animate({
            left: position.left - parseInt(self.width / 2),
            top: position.top - parseInt(self.height / 2)
        }, options);
    },
    timeNeeded: function (position) {
        var distance = this.distanceTo(position);
        var time = distance / this.speed * 1000;
        return time;
    },
    distanceTo: function (position) {
        return WTF.distance(this.position(), position);
    },
    destroy: function () {
        var self = this;
        var o = WTF.objects.findIndex(function (element) {
            return element.id === self.id;
        });
        if (o >= 0) {
            WTF.objects.splice(o, 1);
        }
        self.element.remove();
    }
});