WTF.TeamSelector.addPlayer({
    name: "Roadhog",
    speed: 80,
    width: 90,
    height: 90,
    image: {
        stop: "/images/players/roadhog.png",
        move: "/images/players/roadhog.png",
    },
    health: {
        regen: 2,
        max: 2000
    },
    energy: {
        regen: 1,
        max: 200
    },
    tick: 1,
    abilities: {
        "Melee": {
            label: "Melee",
            bind: "1",
            cooldown: .2,
            damage: {
                min: 0,
                max: 200
            },
            cost: {
                energy: 2
            }
        },
        "Shot": {
            label: "Shot",
            bind: "2",
            cooldown: 1,
            speed: 300,
            damage: {
                min: 30,
                max: 750
            },
            cost: {
                energy: 5
            }
        },
        "Grab": {
            label: "Grab",
            bind: "3",
            cooldown: 15,
            cost: {
                energy: 20
            }
        }
    },
    behavior: "Attacker"
});