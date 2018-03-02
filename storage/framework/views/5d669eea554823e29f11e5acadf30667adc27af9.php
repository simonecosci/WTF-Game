<?php $__env->startSection('content'); ?>
<div class="container">
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
        <?php $__currentLoopData = $players; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $player): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        players.push(
            <?php echo $player['options']; ?>  
        );
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

        for (var i = 0; i < players.length; i++) {
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
    });
</script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>