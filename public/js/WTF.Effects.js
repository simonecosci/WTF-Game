WTF.Effects.Abstract = WTF.Game.Object.extend({

    init: function (options) {
        var options = $.extend(true, {
            duration: 0
        }, options);
        WTF.Game.Object.fn.init.call(this, options);
    }
});


WTF.Effects.Explosion = WTF.Game.Object.extend({
    init: function (options) {
        WTF.Effects.Abstract.fn.init.call(this, options);
        this.element.css({
            display: "inline-block",
            width: 1,
            height: 1,
            opacity: 1
        });
    },
    show: function (position) {
        var self = this;
        self.element.css({
            left: position.left,
            top: position.top
        });
        self.element.addClass("explosion");
        var hits = WTF.isInRange(self.position(), self.options.width);
        self.element.trigger("hits", { hits: hits });
        setTimeout(function () {
            self.element.fadeOut("fast", function () {
                self.destroy();
                self.element.remove();
            });
        }, self.options.duration * 1000);
    }
});