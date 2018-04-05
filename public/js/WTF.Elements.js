WTF.Elements.Abstract = WTF.Game.Object.extend({

    init: function(options) {

        WTF.Game.Object.fn.init.call(this, options);

    }
});

WTF.Elements.Bullet = WTF.Elements.Abstract.extend({

    init: function(options) {
        WTF.Elements.Abstract.fn.init.call(this, options);
        this.element.css({
            borderRadius: "50%",
            backgroundColor: "black",
            display: "inline-block"
        });
    }
    
});

WTF.Elements.Bomb = WTF.Elements.Abstract.extend({

    init: function(options) {
        this.exploded = false;
        WTF.Elements.Abstract.fn.init.call(this, options);
        this.element.css({
            borderRadius: "50%",
            backgroundColor: "black",
            display: "inline-block"
        });
    }
    
});

WTF.Elements.Trap = WTF.Elements.Abstract.extend({

    init: function(options) {
        this.activated = false;
        WTF.Elements.Abstract.fn.init.call(this, options);
        this.element.css({
            borderRadius: "30%",
            backgroundColor: "yellow",
            display: "inline-block",
            border: "1px solid white"
        });
    }
    
});
