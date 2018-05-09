<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use App\Team;
use App\TeamMember;
use App\Fight;

class HomeController extends Controller {

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct() {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $players = $this->getPlayers();
        $teams = Team::where('user_id', Auth::id())->with('teammembers')->get();
        return view('home')->with(compact('teams', 'players'));
    }

    public function getFiles($type) {
        $players_directory = public_path('js/WTF/' . $type);
        return File::files($players_directory);
    }

    public function getPlayers() {
        $files = $this->getFiles('Players');
        $players = collect($files)->map(function($element) {
            $player = File::get($element);
            $player = substr(str_replace('WTF.TeamSelector.addPlayer(', '', $player), 0, -2);
            return [
                'name' => substr(basename($element), 0, -3),
                'options' => $player
            ];
        });
        return $players;
    }

    public function createTeam(Request $request) {
        $data = $request->all();
        $validator = Validator::make($data, [
                    'name' => 'required|string|max:255|unique:teams',
                    'players' => 'required|array'
        ]);
        $players = $this->getPlayers();
        if ($request->isMethod('post')) {
            if (!$validator->fails()) {
                $team = (new Team())->fill([
                    'user_id' => Auth::id(),
                    'name' => $request->name,
                    'played' => 0,
                    'won' => 0,
                    'members' => count($request->players)
                ]);
                $team->save();
                foreach ($request->players as $player) {
                    (new TeamMember())->fill([
                        'team_id' => $team->id,
                        'name' => $player
                    ])->save();
                }
                return redirect()->to(route('team', ['id' => $team->id]));
            }
        }

        return view('create-team')
                        ->with(compact('players'))
                        ->withErrors($validator);
    }

    public function delete($id) {
        $team = Team::with("teammembers")->findOrFail($id);
        if ($team->user_id !== Auth::id()) {
            return abort(401, "This is not your team");
        }
        $team->delete();
        return redirect()->to(route('home'));
    }

    public function team($id) {
        $players = $this->getPlayers();
        $team = Team::with("teammembers")->findOrFail($id);
        if ($team->user_id !== Auth::id()) {
            return abort(401, "This is not your team");
        }
        return view('team')->with(compact('team', 'players'));
    }

    public function play($id) {
        $players = $this->getPlayers();
        $team = Team::with("teammembers")->findOrFail($id);
        if ($team->user_id !== Auth::id()) {
            return abort(401, "This is not your team");
        }
        $teams = Team::with("teammembers")
                ->where('members', $team->members)
                ->where('user_id', '!=', Auth::id())
                ->paginate(10);
        return view('play')->with(compact('team', 'teams', 'players'));
    }

    public function fight($id, $against) {
        $partecipants = [];

        $team = Team::with("teammembers")->findOrFail($id);
        if ($team->user_id !== Auth::id()) {
            return abort(401, "This is not your team");
        }

        $enemy = Team::with("teammembers")
                ->where('members', $team->members)
                ->where('user_id', '!=', Auth::id())
                ->where('id', $against)
                ->firstOrFail();

        foreach ($team->teammembers as $player) {
            if (in_array($player->name, $partecipants)) {
                continue;
            }
            $partecipants[] = $player->name;
        }
        foreach ($enemy->teammembers as $player) {
            if (in_array($player->name, $partecipants)) {
                continue;
            }
            $partecipants[] = $player->name;
        }
        $players = collect($this->getFiles('Players'))->map(function($element) {
            return '/js/WTF/Players/' . basename($element);
        })->unique();
        
        $fight = new Fight();
        $fight->fill([
            'team_id' => $team->id,
            'against_id' => $enemy->id,
            'key' => $this->uuid(),
            'result' => ''
        ]);
        $fight->save();

        return view('fight')->with([
            'key' => $fight->key,
            'players' => $players,
            'teams' => compact('team', 'enemy')
        ]);
    }
    
    public function result(Request $request) {
        
        if (!$request->has('key') || !$request->has('result')) {
            throw new Exception('Missing parameters', 500);
        }
        
        if (empty($request->key) || empty($request->result)) {
            throw new Exception('Missing parameters', 500);
        }
        $fight = Fight::with('team')->where('key', $request->key)->first();
        if (empty($fight)) {
            return abort(401, "Key not found");
        }
        if ($fight->team->user_id !== Auth::id()) {
            return abort(401, "This is not your team");
        }
        $fight->result = $request->result === 'won' ? 'won' : 'lost';
        $team = Team::find($fight->team_id);
        if ($fight->result === 'won') {
            $message = 'Congratulations you won the match';
            $team->won += 1;
        } else {
            $message = 'Will be better next time. You lost the match';
        }
        $fight->save();
        $team->played += 1;
        $team->save();
        return $message;
    }

    protected function uuid() {
        mt_srand((double)microtime()*10000);//optional for php 4.2.0 and up.
        $charid = strtoupper(md5(uniqid(rand(), true)));
        $hyphen = chr(45);// "-"
        $uuid = chr(123)// "{"
            .substr($charid, 0, 8).$hyphen
            .substr($charid, 8, 4).$hyphen
            .substr($charid,12, 4).$hyphen
            .substr($charid,16, 4).$hyphen
            .substr($charid,20,12)
            .chr(125);// "}"
        return $uuid;
    }
    
}
