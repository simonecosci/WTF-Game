WTF.AbilityTypes = {
    Attack: 0,
    Defense: 1,
    Heal: 2
};

WTF.Abilities.Abstract = kendo.Class.extend({
    init: function (options, owner) {
        this.defaults = {
            description: "Description of the ability",
            label: "Abstract",
            cooldown: 0,
        };
        this.type = null;
        this.usable = true;
        this.owner = owner;
        this.options = $.extend(true, this.defaults, options);
    },
    check: function () {
        var self = this;
        if (!self.usable) {
            return false;
        }
        var elements = ["energy", "health"];
        for (var i in elements) {
            if (self.options.cost && self.options.cost[elements[i]]) {
                if (self.options.cost[elements[i]] > self.owner[elements[i]].value) {
                    if (WTF.selection === self.owner) {
                        WTF.notification.warning(self.options.label + " not enough " + elements[i]);
                    }
                    if (WTF.debug) {
                        console.log(self.owner.type + ":" + self.owner.name + " - " + self.options.label + " not enough " + elements[i]);
                    }
                    return false;
                }
                self.owner[elements[i]].set("value", self.owner[elements[i]].value - self.options.cost[elements[i]]);
            }
            return true;
        }
    },
    use: function () {
        if (!this.check())
            return false;
        if ($.isFunction(this.options.use)) {
            return this.options.use.call(this);
        }
    },
    cooldown: function (seconds) {
        var self = this;
        self.usable = false;
        if (WTF.selection && self.owner.id === WTF.selection.id) {
            WTF.toolbar.find("#ability-" + self.options.bind).find("span").text(self.options.label + "(" + cd + ")");
            var cd = seconds || self.options.cooldown;
            (function () {
                var fn = arguments.callee;
                setTimeout(function () {
                    cd -= 1;
                    WTF.toolbar.find("#ability-" + self.options.bind).find("span").text(self.options.label + "(" + cd + ")");
                    if (cd > 0) {
                        return fn.call()
                    }
                    WTF.toolbar.find("#ability-" + self.options.bind).find("span").text(self.options.label);
                }, 1000);
            })();
        }
        self.timeout = setTimeout(function () {
            self.usable = true;
            if (WTF.selection && self.owner.id === WTF.selection.id) {
                WTF.toolbar.find("#ability-" + self.options.bind).data("kendoButton").enable(true);
                WTF.toolbar.find("#ability-" + self.options.bind).find("span").text(self.options.label);
            }
        }, (seconds || self.options.cooldown) * 1000);
        if (WTF.selection && self.owner.id === WTF.selection.id) {
            WTF.toolbar.find("#ability-" + self.options.bind).data("kendoButton").enable(false);
        }
    },
    damage: function (target) {
        var self = this;
        var damage = WTF.randomInt(self.options.damage.min, self.options.damage.max);
        target.stats.set("damagesTaken", target.stats.damagesTaken + damage);
        self.owner.stats.set("damagesDone", self.owner.stats.damagesDone + damage);
        target.health.set("value", target.health.value - damage);
        new WTF.Notifications.Damage(damage).show(target.position());
    },
    heal: function (target) {
        var self = this;
        var heal = WTF.randomInt(self.options.heal.min, self.options.heal.max);
        target.stats.set("healsTaken", target.stats.healsTaken + heal);
        self.owner.stats.set("healsDone", self.owner.stats.healsDone + heal);
        target.health.set("value", target.health.value + heal);
        new WTF.Notifications.Heal(heal).show(target.position());
    }

});

WTF.Abilities.Shot = WTF.Abilities.Abstract.extend({
    init: function (options, owner) {
        var options = $.extend(true, {
            description: "Shot a projectile to the target enemy dealing up " + options.damage.min + " to " + options.damage.max + " damages",
            width: 5,
            height: 5,
            speed: 150,
            range: {
                min: 0,
                max: 500
            }
        }, options);
        WTF.Abilities.Abstract.fn.init.call(this, options, owner);
        this.type = WTF.AbilityTypes.Attack
    },
    use: function () {
        var self = this;
        if (!self.usable) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Not ready yet");
            }
            if (WTF.debug) {
                console.log(self.owner.type + ":" + self.owner.name + " - " + self.options.label + " Not ready yet");
            }
            return false;
        }
        if (!self.owner.target) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Select a target");
            }
            if (WTF.debug) {
                console.log(self.owner.type + ":" + self.owner.name + " - " + self.options.label + " Select a target");
            }
            return false;
        }
        if (self.owner.type === self.owner.target.type) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Invalid target");
            }
            if (WTF.debug) {
                console.log(self.owner.type + ":" + self.owner.name + " - " + self.options.label + " Invalid target");
            }
            return false;
        }
        if (self.options.range) {
            var distance = self.owner.distanceTo(self.owner.target.position());
            if (distance < self.options.range.min) {
                if (WTF.selection === self.owner) {
                    WTF.notification.warning(self.options.label + " Target too close");
                }
                if (WTF.debug) {
                    console.log(self.owner.type + ":" + self.owner.name + " - " + self.options.label + " Target too close");
                }
                return false;
            }
            if (distance > self.options.range.max) {
                if (WTF.selection === self.owner) {
                    WTF.notification.warning(self.options.label + " Target too far");
                }
                if (WTF.debug) {
                    console.log(self.owner.type + ":" + self.owner.name + " - " + self.options.label + " Target too far");
                }
                return false;
            }
        }
        if (!self.check()) {
            if (WTF.debug) {
                console.log(self.owner.type + ":" + self.owner.name + " - " + self.options.label + " Check failed");
            }
            return false;
        }
        self.cooldown();
        var bullet = new WTF.Elements.Bullet({
            top: self.owner.position().top,
            left: self.owner.position().left,
            speed: self.options.speed,
            width: self.options.width,
            height: self.options.height
        });
        bullet.moveTo(self.owner.target.position(), {
            complete: function () {
                bullet.element.stop();
                bullet.destroy();
            }
        });
        bullet.element.on("hit", function (e, hit) {
            if (hit === self.owner) {
                return;
            }
            if (!hit.type) {
                return;
            }
            if (self.owner.type === hit.type) {
                return;
            }
            if (!hit.options.hitable) {
                return;
            }
            bullet.element.off("hit");
            bullet.element.stop();
            bullet.destroy();
            self.damage(hit);
        });
        return true;
    }
});

WTF.Abilities.Heal = WTF.Abilities.Abstract.extend({
    init: function (options, owner) {
        var options = $.extend(true, {
            description: "Heal the friendly target up " + options.heal.min + " to " + options.heal.max + " health points",
        }, options);
        WTF.Abilities.Abstract.fn.init.call(this, options, owner);
        this.type = WTF.AbilityTypes.Heal;
    },
    use: function () {
        var self = this;
        if (!self.usable) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Not ready yet");
            }
            if (WTF.debug) {
                console.log(self.owner.type + ":" + self.owner.name + " - " + self.options.label + " Not ready yet");
            }
            return false;
        }
        if (!self.owner.target) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Select a target");
            }
            if (WTF.debug) {
                console.log(self.owner.type + ":" + self.owner.name + " - " + self.options.label + " Select a target");
            }
            return false;
        }
        if (self.owner.target.type !== self.owner.type) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Invalid target");
            }
            if (WTF.debug) {
                console.log(self.owner.type + ":" + self.owner.name + " - " + self.options.label + " Invalid target");
            }
            return false;
        }
        if (!self.check())
            return false;
        self.heal(self.owner.target);
        self.cooldown();
        return true;
    }
});

WTF.Abilities.Melee = WTF.Abilities.Abstract.extend({
    init: function (options, owner) {
        var options = $.extend(true, {
            description: "Hit the target with melee weapon dealing up " + options.damage.min + " to " + options.damage.max + " damages",
            width: 1,
            height: 1,
            range: {
                min: 0,
                max: 100
            }
        }, options);
        WTF.Abilities.Abstract.fn.init.call(this, options, owner);
        this.type = WTF.AbilityTypes.Attack;
    },
    use: function () {
        var self = this;
        if (!self.usable) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Not ready yet");
            }
            if (WTF.debug) {
                console.log(self.owner.type + ":" + self.owner.name + " - " + self.options.label + " Not ready yet");
            }
            return false;
        }
        if (!self.owner.target) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Select a target");
            }
            if (WTF.debug) {
                console.log(self.owner.type + ":" + self.owner.name + " - " + self.options.label + " Select a target");
            }
            return false;
        }
        if (self.owner.type === self.owner.target.type) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Invalid target");
            }
            if (WTF.debug) {
                console.log(self.owner.type + ":" + self.owner.name + " - " + self.options.label + " Invalid target");
            }
            return false;
        }
        var distance = self.owner.distanceTo(self.owner.target.position());
        if (distance < self.options.range.min) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Target too close");
            }
            if (WTF.debug) {
                console.log(self.owner.type + ":" + self.owner.name + " - " + self.options.label + " Target too close");
            }
            return false;
        }
        if (distance > self.options.range.max) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Target too far");
            }
            if (WTF.debug) {
                console.log(self.owner.type + ":" + self.owner.name + " - " + self.options.label + " Target too far");
            }
            return false;
        }
        if (!self.check())
            return false;
        self.cooldown();
        if (!self.owner.target.options.hitable) {
            return false;
        }
        self.damage(self.owner.target);
        return true;
    }
});

WTF.Abilities.Bomb = WTF.Abilities.Abstract.extend({
    init: function (options, owner) {
        var options = $.extend(true, {
            description: "Launch a bomb to the target enemy dealing up " + options.damage.min + " to " + options.damage.max + " damages",
            width: 15,
            height: 15,
            speed: 100,
            range: {
                min: 0,
                max: 300
            }
        }, options);
        WTF.Abilities.Abstract.fn.init.call(this, options, owner);
        this.type = WTF.AbilityTypes.Attack;
    },
    explode: function (bomb) {
        var self = this;
        bomb.exploded = true;
        var explosion = new WTF.Effects.Explosion({
            duration: 1,
            width: 100,
            height: 100,
        });
        explosion.element.on("hits", function (e, data) {
            explosion.element.off("hits");
            data.hits.forEach(hit => {
                if (hit === bomb) {
                    return;
                }
                if (hit === self.owner) {
                    return;
                }
                if (!hit.type) {
                    return;
                }
                if (self.owner.type === hit.type) {
                    return;
                }
                if (!hit.options.hitable) {
                    return;
                }
                self.damage(hit);
            });
        });
        explosion.show(bomb.position(), self.options.range.max);
    },
    use: function () {
        var self = this;
        if (!self.usable) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Not ready yet");
            }
            return false;
        }
        if (!self.owner.target) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Select a target");
            }
            return false;
        }
        if (self.owner.type === self.owner.target.type) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Invalid target");
            }
            return false;
        }
        if (self.owner.target.id === self.owner.id) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Invalid target");
            }
            return false;
        }
        var distance = self.owner.distanceTo(self.owner.target.position());
        if (distance < self.options.range.min) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Target too close");
            }
            return false;
        }
        if (distance > self.options.range.max) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Target too far");
            }
            return false;
        }
        if (!self.check())
            return false;
        self.cooldown();
        var bomb = new WTF.Elements.Bomb({
            top: self.owner.position().top,
            left: self.owner.position().left,
            speed: self.options.speed,
            width: self.options.width,
            height: self.options.height
        });
        var to = self.owner.target.position();
        bomb.moveTo(to, {
            complete: function () {
                if (!self.exploded) {
                    self.explode(bomb);
                }
                bomb.element.stop();
                bomb.destroy();
            },
            step: function () {
                WTF.objects.forEach(element => {
                    if (WTF.overlaps(bomb, element)) {
                        bomb.element.trigger("hit", element);
                    }
                });
            }
        });
        bomb.element.on("hit", function (e, hit) {
            if (hit === bomb) {
                return false;
            }
            if (hit === self.owner) {
                return false;
            }
            if (!hit.type) {
                return false;
            }
            if (self.owner.type === hit.type) {
                return false;
            }
            if (!hit.options.hitable) {
                return false;
            }
            if (!bomb.exploded) {
                self.explode(bomb);
            }
            bomb.element.stop();
            bomb.destroy();
            return true;
        });
    }
});

WTF.Abilities.Charge = WTF.Abilities.Abstract.extend({
    init: function (options, owner) {
        var options = $.extend(true, {
            description: "Charge the target dealing up " + options.damage.min + " to " + options.damage.max + " damages",
            speed: 600,
            range: {
                min: 100,
                max: 1000
            }
        }, options);
        WTF.Abilities.Abstract.fn.init.call(this, options, owner);
        this.type = WTF.AbilityTypes.Attack;
    },
    use: function () {
        var self = this;
        if (!self.usable) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Not ready yet");
            }
            return false;
        }
        if (!self.owner.target) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Select a target");
            }
            return false;
        }
        if (self.owner.type === self.owner.target.type) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Invalid target");
            }
            return false;
        }
        if (self.owner.target.id === self.owner.id) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Invalid target");
            }
            return false;
        }
        var distance = self.owner.distanceTo(self.owner.target.position());
        if (distance < self.options.range.min) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Target too close");
            }
            return false;
        }
        if (distance > self.options.range.max) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Target too far");
            }
            return false;
        }
        if (!self.check())
            return false;
        self.cooldown();
        if (!self.owner.target.options.hitable) {
            return false;
        }
        self.owner.speed = self.options.speed;
        var chained = {};
        self.owner.moveTo(self.owner.target.position(), {
            step: function () {
                WTF.objects.forEach(element => {
                    if (WTF.overlaps(self.owner, element)) {
                        if (!element.type) {
                            return;
                        }
                        if (element.type === self.owner.type) {
                            return;
                        }
                        if (!element.options.hitable) {
                            return;
                        }
                        if (chained[element.id]) {
                            return;
                        }
                        chained[element.id] = element;
                        element.speed = self.options.speed;
                        element.moveTo(self.owner.target.position(), {
                            complete: function () {
                                element.speed = element.options.speed;
                                self.damage(element);
                            }
                        });
                    }
                });
            },
            complete: function () {
                self.owner.speed = self.owner.options.speed;
            }
        });
        return true;
    }
});

WTF.Abilities.Shield = WTF.Abilities.Abstract.extend({
    init: function (options, owner) {
        var options = $.extend(true, {
            description: "Shield the selected friendly target for " + options.duration + " seconds",
        }, options);
        WTF.Abilities.Abstract.fn.init.call(this, options, owner);
        this.type = WTF.AbilityTypes.Defense;
    },
    use: function () {
        var self = this;
        if (!self.usable) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Not ready yet");
            }
            return false;
        }
        if (!self.owner.target) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Select a target");
            }
            return false;
        }
        if (self.owner.type !== self.owner.target.type) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Invalid target");
            }
            return false;
        }
        if (!self.check())
            return false;
        self.cooldown();
        if (!self.owner.target.options.hitable) {
            return false;
        }
        self.owner.target.element.css({
            boxShadow: "0px 0px 10px #00f"
        });
        self.owner.target.hittable = false;
        setTimeout(function () {
            self.owner.target.element.css({
                boxShadow: "none"
            });
            self.owner.target.hittable = true;
        }, self.options.duration * 1000);
        return true;
    }
});

WTF.Abilities.ShadowStep = WTF.Abilities.Abstract.extend({
    init: function (options, owner) {
        var options = $.extend(true, {
            description: "Move instantly close the selected target",
        }, options);
        WTF.Abilities.Abstract.fn.init.call(this, options, owner);
        this.type = WTF.AbilityTypes.Defense;
    },
    use: function () {
        var self = this;
        if (!self.usable) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Not ready yet");
            }
            return false;
        }
        if (!self.owner.target) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Select a target");
            }
            return false;
        }
        if (!self.check())
            return false;
        self.cooldown();
        self.owner.position(self.owner.target.position());
        return true;
    }
});

WTF.Abilities.Grab = WTF.Abilities.Abstract.extend({
    init: function (options, owner) {
        var options = $.extend(true, {
            description: "Grab instantly selected target close to you",
        }, options);
        WTF.Abilities.Abstract.fn.init.call(this, options, owner);
        this.type = WTF.AbilityTypes.Attack;
    },
    use: function () {
        var self = this;
        if (!self.usable) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Not ready yet");
            }
            return false;
        }
        if (!self.owner.target) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Select a target");
            }
            return false;
        }
        if (!self.check())
            return false;
        self.cooldown();
        self.owner.target.position(self.owner.position());
        return true;
    }
});

WTF.Abilities.Explode = WTF.Abilities.Abstract.extend({
    init: function (options, owner) {
        var options = $.extend(true, {
            description: "Explode dealing up " + options.damage.min + " to " + options.damage.max + " damages",
            range: {
                min: 0,
                max: 100
            },
            ccoldown: 20
        }, options);
        WTF.Abilities.Abstract.fn.init.call(this, options, owner);
        this.type = WTF.AbilityTypes.Attack;
    },
    use: function () {
        var self = this;
        if (!self.usable) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Not ready yet");
            }
            if (WTF.debug) {
                console.log(self.owner.type + ":" + self.owner.name + " - " + self.options.label + " Not ready yet");
            }
            return false;
        }
        if (!self.check())
            return false;
        self.cooldown();
        var explosion = new WTF.Effects.Explosion({
            duration: 2,
            width: 100,
            height: 100,
        });
        explosion.show(self.owner.position());
        WTF.players.enemy.forEach(enemy => {
            if (!enemy.option.hitable)
                return;
            var distance = self.owner.distanceTo(enemy.position());
            if (distance < self.options.range.max) {
                self.damage(enemy);
            }
        });
        return true;
    }
});

WTF.Abilities.Trap = WTF.Abilities.Abstract.extend({
    init: function (options, owner) {
        var options = $.extend(true, {
            description: "Place a trap avoiiding enemy movements for some seconds",
            width: 10,
            height: 10,
            cooldown: 30,
            duration: 5
        }, options);
        WTF.Abilities.Abstract.fn.init.call(this, options, owner);
        this.type = WTF.AbilityTypes.Attack;
    },
    use: function () {
        var self = this;
        if (!self.usable) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Not ready yet");
            }
            if (WTF.debug) {
                console.log(self.owner.type + ":" + self.owner.name + " - " + self.options.label + " Not ready yet");
            }
            return false;
        }
        if (!self.check())
            return false;
        self.cooldown();
        var trap = new WTF.Elements.Trap({
            top: self.owner.position().top,
            left: self.owner.position().left,
            width: self.options.width,
            height: self.options.height
        });
        trap.position(self.owner.position());
        trap.timeout = setTimeout(function() {
            clearTimeout(trap.timeout);
            clearInterval(trap.interval);
            trap.destroy();
            trap.element.remove();
        }, self.options.cooldown * 1000);
        trap.interval = setInterval(function(){
            WTF.objects.forEach(element => {
                if (WTF.overlaps(trap, element)) {
                    trap.element.trigger("hit", element);
                }
            });
        }, 100);
        trap.element.on("hit", function(e, hit) {
            if (!hit.type) 
                return;
            if (trap.activated)
                return;
            if (hit.type === self.owner.type)
                return;
            trap.activated = true;
            hit.options.movable = false;
            hit.element.stop(true, false);
            hit.behavior.stop();
            
            setTimeout(function() {
                hit.options.movable = true;
                hit.behavior.start();
            }, self.options.duration * 1000);
            
            clearTimeout(trap.timeout);
            clearInterval(trap.interval);
            trap.destroy();
            trap.element.remove();
        });
        return true;
    }
});

WTF.Abilities.HealingShot = WTF.Abilities.Abstract.extend({
    init: function (options, owner) {
        var options = $.extend(true, {
            description: "Shot a projectile to the friendly team healing up " + options.heal.min + " to " + options.heal.max + " points",
            width: 5,
            height: 5,
            speed: 150,
            range: {
                min: 0,
                max: 500
            },
            heal: {
                min: 10,
                max: 150
            }
        }, options);
        WTF.Abilities.Abstract.fn.init.call(this, options, owner);
        this.type = WTF.AbilityTypes.Heal;
    },
    use: function () {
        var self = this;
        if (!self.usable) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Not ready yet");
            }
            if (WTF.debug) {
                console.log(self.owner.type + ":" + self.owner.name + " - " + self.options.label + " Not ready yet");
            }
            return false;
        }
        if (self.owner.type !== self.owner.target.type) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Invalid target");
            }
            if (WTF.debug) {
                console.log(self.owner.type + ":" + self.owner.name + " - " + self.options.label + " Invalid target");
            }
            return false;
        }
        if (self.options.range) {
            var distance = self.owner.distanceTo(self.owner.target.position());
            if (distance < self.options.range.min) {
                if (WTF.selection === self.owner) {
                    WTF.notification.warning(self.options.label + " Target too close");
                }
                if (WTF.debug) {
                    console.log(self.owner.type + ":" + self.owner.name + " - " + self.options.label + " Target too close");
                }
                return false;
            }
            if (distance > self.options.range.max) {
                if (WTF.selection === self.owner) {
                    WTF.notification.warning(self.options.label + " Target too far");
                }
                if (WTF.debug) {
                    console.log(self.owner.type + ":" + self.owner.name + " - " + self.options.label + " Target too far");
                }
                return false;
            }
        }
        if (!self.check()) {
            if (WTF.debug) {
                console.log(self.owner.type + ":" + self.owner.name + " - " + self.options.label + " Check failed");
            }
            return false;
        }
        self.cooldown();
        var bullet = new WTF.Elements.Bullet({
            top: self.owner.position().top,
            left: self.owner.position().left,
            speed: self.options.speed,
            width: self.options.width,
            height: self.options.height
        });
        bullet.moveTo(self.owner.target.position(), {
            complete: function () {
                bullet.element.stop();
                bullet.destroy();
            }
        });
        bullet.element.on("hit", function (e, hit) {
            if (!hit.type) {
                return;
            }
            if (self.owner.type !== hit.type) {
                return;
            }
            bullet.element.off("hit");
            bullet.element.stop();
            bullet.destroy();
            self.heal(hit);
        });
        return true;
    }
});

WTF.Abilities.Sprint = WTF.Abilities.Abstract.extend({
    init: function (options, owner) {
        var options = $.extend(true, {
            description: "Sprint to reach the target dealing up " + options.damage.min + " to " + options.damage.max + " damages",
            speed: 600,
            range: {
                min: 0,
                max: 700
            }
        }, options);
        WTF.Abilities.Abstract.fn.init.call(this, options, owner);
        this.type = WTF.AbilityTypes.Attack;
    },
    use: function () {
        var self = this;
        if (!self.usable) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Not ready yet");
            }
            return false;
        }
        if (!self.owner.target) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Select a target");
            }
            return false;
        }
        if (self.owner.type === self.owner.target.type) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Invalid target");
            }
            return false;
        }
        if (self.owner.target.id === self.owner.id) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Invalid target");
            }
            return false;
        }
        var distance = self.owner.distanceTo(self.owner.target.position());
        if (distance < self.options.range.min) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Target too close");
            }
            return false;
        }
        if (distance > self.options.range.max) {
            if (WTF.selection === self.owner) {
                WTF.notification.warning(self.options.label + " Target too far");
            }
            return false;
        }
        if (!self.check())
            return false;
        self.cooldown();
        if (!self.owner.target.options.hitable) {
            return false;
        }
        self.owner.speed = self.options.speed;
        self.owner.moveTo(self.owner.target.position(), {
            step: function () {
                WTF.objects.forEach(element => {
                    if (WTF.overlaps(self.owner, element)) {
                        if (!element.type) {
                            return;
                        }
                        if (element.type === self.owner.type) {
                            return;
                        }
                        if (!element.options.hitable) {
                            return;
                        }
                        self.damage(element);
                    }
                });
            },
            complete: function () {
                self.owner.speed = self.owner.options.speed;
            }
        });
        return true;
    }
});
