@extends('layouts.app')

@section('content')
<div class="container">
    <a class="btn btn-primary" href="{{ route('home') }}">Back to dashboard</a>
    <div class="row">
        <div class="col-md-4">
            <small>Won</small>
            <h2>{{ $team->won }}</h2>
        </div>
        <div class="col-md-4">
            <small>Played</small>
            <h2>{{ $team->played }}</h2>
        </div>
        <div class="col-md-4">
            <small>Rank</small>
            <h2>{{ $team->won > 0 ? number_format($team->played / $team->won * 100, 2) : 0 }}%</h2>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="panel panel-default">
                <div class="panel-heading">Players</div>
                <div class="panel-body">
                    <table id="players" class="table table-bordered table-condensed table-striped">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Info</th>
                                <th>Ability1</th>
                                <th>Ability2</th>
                                <th>Ability3</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                        <tfoot>
                            <tr>
                                <td colspan="5">
                                    <div class="text-center">
                                        <a href="{{ route('play', ['id' => $team->id ]) }}" class="btn btn-primary">Play</a>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
<script id="row-template" type="tf/x-template" style="display: none">
    <tr>
        <td valign=top class="player-img">
            <img src="" >
        </td>
        <td valign=top class=player-info></td>
        <td valign=top class=player-ability1></td>
        <td valign=top class=player-ability2></td>
        <td valign=top class=player-ability3></td>
    </tr>
</script>
<script>
    $(document).ready(function(){
        var players = [];
        @foreach($players as $player)
        players.push(
            {!! $player['options'] !!}  
        );
        @endforeach
        
        
        var members = {!! $team->teammembers->toJson() !!};
        for (var m = 0; m < members.length; m++) {
            
            for (var i = 0; i < players.length; i++) {
                
                if (members[m].name != players[i].name) {
                    continue;
                }
                
                var row = $("#row-template").html();
                var info = [
                    "Name: <b>" + players[i].name + "</b>",
                    "Speed: <b>" + players[i].speed + "</b> px/sec",
                    "Hitbox: <b>" + players[i].width + "x" + players[i].height + "</b>",
                    "Health: <b>" + players[i].health.max + "</b> (" + players[i].health.regen + "/sec regen.)",
                    "Energy: <b>" + players[i].energy.max + "</b> (" + players[i].energy.regen + "/sec regen.)",
                    "Behavior: <b>" + players[i].behavior + "</b>"
                ];
                $("#players tbody").append(row);
                var last = $("#players tbody tr:last");
                last.find(".player-img img")
                        .attr("src", players[i].image.stop)
                        .css({
                            width: "80px",
                            height: "auto"
                        });
                last.find(".player-info").html(info.join("<br>"));
                var index = 1;
                for(var abilityName in players[i].abilities) {
                    var ability = [
                        "Name: <b>" + abilityName + "</b>",
                        "Bind: <b>" + players[i].abilities[abilityName].bind + "</b>",
                        "Cooldown: <b>" + players[i].abilities[abilityName].cooldown + "</b>",
                        "Speed: <b>" + players[i].abilities[abilityName].speed + "</b>",
                        "Duration: <b>" + players[i].abilities[abilityName].duration + "</b>",
                    ];
                    if (players[i].abilities[abilityName].cost) {
                        if (players[i].abilities[abilityName].cost.energy) {
                            ability.push("Cost: <b>" + players[i].abilities[abilityName].cost.energy + "</b> Energy");
                        }
                        if (players[i].abilities[abilityName].cost.health) {
                            ability.push("Cost: <b>" + players[i].abilities[abilityName].cost.health + "</b> Health");
                        }
                    }
                    if (players[i].abilities[abilityName].range) {
                        ability.push("Range: <b>" + players[i].abilities[abilityName].range.min + " - " + players[i].abilities[abilityName].range.max + "</b>");
                    }
                    if (players[i].abilities[abilityName].damage) {
                        ability.push("Damage: <b>" + players[i].abilities[abilityName].damage.min + " - " + players[i].abilities[abilityName].damage.max + "</b>");
                    }
                    if (players[i].abilities[abilityName].heal) {
                        ability.push("Heal: <b>" + players[i].abilities[abilityName].heal.min + " - " + players[i].abilities[abilityName].heal.max + "</b>");
                    }

                    last.find(".player-ability" + index).html(ability.join("<br>"));
                    index++;
                }
            }
        }

    });
</script>
@endsection
