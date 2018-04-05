WTF.TeamSelector.addPlayer({
    name: "Reinhardt",
    speed: 50,
    width: 150,
    height: 150,
    image: {
        stop: "/images/players/reinhardt.png",
        move: "/images/players/reinhardt.png",
    },
    health: {
        regen: 5,
        max: 6000
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
                max: 100
            },
            cost: {
                energy: 2
            },
        },
        "Charge": {
            label: "Charge",
            bind: "2",
            cooldown: 14,
            damage: {
                min: 200,
                max: 1000
            },
            cost: {
                energy: 20
            }
        },
        "Shield": {
            label: "Shield",
            bind: "3",
            cooldown: 30,
            duration: 15,
            cost: {
                energy: 10
            }
        },
    },
    behavior: "Tank"
});