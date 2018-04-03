WTF.TeamSelector.addPlayer({
    name: "The Reaper",
    speed: 80,
    width: 90,
    height: 90,
    image: {
        stop: "/images/players/reaper.png",
        move: "/images/players/reaper.png",
    },
    health: {
        regen: 2,
        max: 1000
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
            speed: 500,
            damage: {
                min: 30,
                max: 750
            },
            cost: {
                energy: 5
            }
        },
        "ShadowStep": {
            label: "Shadow Step",
            bind: "3",
            cooldown: 10,
            cost: {
                energy: 15
            }
        }
    },
    behavior: "Attacker"
});