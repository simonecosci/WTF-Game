WTF.TeamSelector.addPlayer({
    name: "Bastion",
    speed: 80,
    width: 80,
    height: 80,
    image: {
        stop: "/images/players/bastion.png",
        move: "/images/players/bastion.png",
    },
    health: {
        regen: 1,
        max: 1200
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
        "Shot": {
            label: "Shot",
            bind: "2",
            cooldown: 2,
            speed: 600,
            damage: {
                min: 30,
                max: 750
            },
            cost: {
                energy: 5
            },
            range: {
                min: 10,
                max: 700
            }
        }
    },
    behavior: "Attacker"
});