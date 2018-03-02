WTF.Notifications.Abstract = kendo.Class.extend({
    init: function (value) {
        this.duration = .5;
        this.element = $("<span/>");
        this.element.css({
            fontSize: "100%",
            forntWeight: "bold",
            textShadow: "0 0 3px black",
            position: "absolute"
        });
        this.element.text(value);
    },
    show: function (position) {
        var self = this;
        self.element.appendTo(WTF.stage);
        self.element.css(position);
        self.element.show();
        self.element.animate({
            top: parseInt(self.element.css("top")) - 50,
            fontSize: "200%",
        }, {
                duration: self.duration * 1000,
                queue: false,
                easing: "linear",
                complete: function () {
                    self.element.fadeOut("fast", function () {
                        self.element.remove();
                    });
                },
            });
    }
});

WTF.Notifications.Damage = WTF.Notifications.Abstract.extend({
    init: function (value) {
        WTF.Notifications.Abstract.fn.init.call(this, value);
        this.element.css("color", "yellow");
    }
});

WTF.Notifications.Heal = WTF.Notifications.Abstract.extend({
    init: function (value) {
        WTF.Notifications.Abstract.fn.init.call(this, value);
        this.element.css("color", "green");
    }
});