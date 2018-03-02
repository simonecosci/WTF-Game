<?php $__env->startSection('content'); ?>
<div class="container">
    <div class="row">
        <div class="col-md-12">
            <div class="panel panel-default">
                <div class="panel-heading">Dashboard</div>

                <div class="panel-body">
                    <?php if(session('status')): ?>
                    <div class="alert alert-success">
                        <?php echo e(session('status')); ?>

                    </div>
                    <?php endif; ?>
                    <a class="btn btn-primary" href="/create-team">Create a new Team</a>
                    <?php if($teams->count() === 0): ?>
                    <div class="alert alert-info">
                        No teams created
                    </div>
                    <?php else: ?>

                    <table id="teams" class="table table-bordered table-condensed table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Played</th>
                                <th>Won</th>
                                <th>Type</th>
                                <th>Last play</th>
                                <th>Players</th>
                                <th>&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>

                            <?php $__currentLoopData = $teams; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $team): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <tr>
                                <td><?php echo e($team->name); ?></td>
                                <td><?php echo e($team->played); ?></td>
                                <td><?php echo e($team->won); ?></td>
                                <td><?php echo e($team->members); ?> vs <?php echo e($team->members); ?></td>
                                <td><?php echo e($team->updated_at); ?></td>
                                <td>
                                    <?php $__currentLoopData = $team->teammembers; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $player): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <img title="<?php echo e($player->name); ?>" style="width: 30px; height: auto;">
                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                </td>
                                <td>
                                    <a href="<?php echo e(route('play', ['id' => $team->id])); ?>" class="btn btn-primary btn-sm">Play</a>
                                </td>
                            </tr>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        </tbody>
                    </table>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    $(document).ready(function () {
        var players = [];
                <?php $__currentLoopData = $players; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $player): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        players.push(
        <?php echo $player['options']; ?>

        );
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                console.log(players);
        for (var i = 0; i < players.length; i++) {
            $("[title='" + players[i].name + "']").attr("src", players[i].image.stop);
        }
    });
</script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_except(get_defined_vars(), array('__data', '__path')))->render(); ?>