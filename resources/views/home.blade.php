@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row">
        <div class="col-md-12">
            <div class="panel panel-default">
                <div class="panel-heading">Dashboard</div>

                <div class="panel-body">
                    @if (session('status'))
                    <div class="alert alert-success">
                        {{ session('status') }}
                    </div>
                    @endif
                    <a class="btn btn-primary" href="/create-team">Create a new Team</a>
                    @if ($teams->count() === 0)
                    <div class="alert alert-info">
                        No teams created
                    </div>
                    @else

                    <table id="teams" class="table table-bordered table-condensed table-striped">
                        <thead>
                            <tr>
                                <th>&nbsp;</th>
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

                            @foreach($teams as $team)
                            <tr>
                                <td>
                                    <a href="{{ route('team', ['id' => $team->id]) }}" class="btn btn-primary btn-sm">View</a>
                                </td>
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
                                <td>
                                    <a href="{{ route('play', ['id' => $team->id]) }}" class="btn btn-primary btn-sm">Play</a>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                    @endif
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
        console.log(players);
        for (var i = 0; i < players.length; i++) {
            $("[title='" + players[i].name + "']").attr("src", players[i].image.stop);
        }
    });
</script>
@endsection
