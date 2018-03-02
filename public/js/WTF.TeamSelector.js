WTF.TeamSelector = {
    players: [],
    addPlayer: function(player) {
        this.players.push(player);
    },
    loadPlayers: function(players, callback) {
        var self = this;
        new WTF.Loader(players).load().then(function(){
            callback.call(self);
        });
    }
};