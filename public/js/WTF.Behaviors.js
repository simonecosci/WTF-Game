WTF.Behaviors.Abstract = kendo.Class.extend({
    init: function (options, owner) {
        this.defaults = {
            timeout: 1,
            description: "Description of the behavior",
            label: "Abstract",
        };
        this.priority = [];
        this.timeout = null;
        this.owner = owner;
        this.options = $.extend(true, this.defaults, options);
    },
    check: function () {
        if (this.owner.dead) {
            this.stop();
            return false;
        }
        return true;
    },
    behave: function () {
        if (!this.check())
            return;
        var self = this;
        for (var a in self.owner.abilities) {
            var ability = self.owner.abilities[a];
            for (var x = 0; x < self.priority.length; x++) {
                var priority = self.priority[x];
                if (ability.type === priority) {
                    switch (ability.type) {
                        
                        case WTF.AbilityTypes.Defense:
                            self.owner.target = self.owner;
                            break;
                            
                        case WTF.AbilityTypes.Heal:
                            var type = self.owner.type;
                            var closest = self.owner.closest(type);
                            self.owner.target = closest;
                            if (WTF.players[type].length === 1) {
                                self.owner.target = self.owner;
                            }
                            break;
                            
                        case WTF.AbilityTypes.Attack:
                            var type = self.owner.type === "enemy" ? "team" : "enemy";
                            var closest = self.owner.closest(type);
                            if (!closest) {
                                return;
                            }
                            self.owner.target = closest;
                            break;
                        
                    }
                    if (self.use(ability))
                        return;
                }
            }
        }
    },
    start: function () {
        var self = this;
        self.timeout = setInterval(function () {
            self.behave();
        }, self.options.timeout * 1000);
    },
    stop: function () {
        clearInterval(this.timeout);
    },
    use: function (ability) {
        var self = this;
        if (!ability.usable) {
            return false;
        }
        if (ability.options.range) {
            var type = self.owner.type === "enemy" ? "team" : "enemy";
            var closest = self.owner.closest(type);
            var distance = self.owner.distanceTo(closest.position());
            if (ability.options.range.min > distance) {
                if (closest.position().left < self.owner.position().left) {
                    var left = self.owner.position().left + (ability.options.range.min - distance);
                    if (left > WTF.stage.width())
                        left = WTF.stage.width();
                    return self.owner.moveTo({
                        top: closest.position().top,
                        left: left
                    });
                } else if (closest.position().left > self.owner.position().left) {
                    var left = self.owner.position().left - (ability.options.range.min + distance);
                    if (left < 0)
                        left = 0;
                    return self.owner.moveTo({
                        top: closest.position().top,
                        left: left
                    });
                }
            } else if (ability.options.range.max < distance) {
                return self.owner.moveTo(closest.position());
            } else {
                return ability.use();
            }
        } else {
            return ability.use();
        }
    },
});

WTF.Behaviors.Tank = WTF.Behaviors.Abstract.extend({

    init: function (options, owner) {
        var options = $.extend(true, {
            description: "Defend himself and Attack the closest enemy",
            label: "Tank"
        }, options);
        WTF.Behaviors.Abstract.fn.init.call(this, options, owner);
        this.priority = [
            WTF.AbilityTypes.Defense,
            WTF.AbilityTypes.Attack,
            WTF.AbilityTypes.Heal
        ];
    },

});

WTF.Behaviors.Healer = WTF.Behaviors.Abstract.extend({

    init: function (options, owner) {
        var options = $.extend(true, {
            description: "Heal the closest friendly target",
            label: "Healer"
        }, options);
        WTF.Behaviors.Abstract.fn.init.call(this, options, owner);
        this.priority = [
            WTF.AbilityTypes.Heal,
            WTF.AbilityTypes.Defense,
            WTF.AbilityTypes.Attack
        ];
    },
});


WTF.Behaviors.Attacker = WTF.Behaviors.Abstract.extend({

    init: function (options, owner) {
        var options = $.extend(true, {
            description: "Attack the closest enemy",
            label: "Attacker"
        }, options);
        WTF.Behaviors.Abstract.fn.init.call(this, options, owner);
        this.priority = [
            WTF.AbilityTypes.Attack,
            WTF.AbilityTypes.Defense,
            WTF.AbilityTypes.Heal
        ];
    },

});
