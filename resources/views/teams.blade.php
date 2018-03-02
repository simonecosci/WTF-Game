@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-12">
            <div class="panel panel-default">
                <div class="panel-heading">Teams</div>

                <div class="panel-body">
                    <table id="teams" class="table table-bordered table-condensed table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Played</th>
                                <th>Won</th>
                                <th>Type</th>
                                <th>Last play</th>
                                <th>Players</th>
                            </tr>
                        </thead>
                        <tbody>

                            @foreach($teams as $team)
                            <tr>
                                <td>{{ $team->name }}</td>
                                <td>{{ $team->played }}</td>
                                <td>{{ $team->won }}</td>
                                <td>{{ $team->members }} vs {{ $team->members }}</td>
                                <td>{{ $team->updated_at }}</td>
                                <td>
                                    @foreach($team->teammembers as $player)
                                    <img title="{{ $player->name }}" style="width: 30px; height: auto;">
                                    @endforeach
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    $(document).ready(function () {
        var players = [];
        @foreach($players as $player)
        players.push(
        {!! $player['options'] !!}
        );
        @endforeach
        for (var i = 0; i < players.length; i++) {
            $("[title='" + players[i].name + "']").attr("src", players[i].image.stop);
        }
    });
</script>
@endsection
