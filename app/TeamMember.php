<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model {

    protected $table = 'team_members';
    protected $fillable = [
        'team_id', 'name'
    ];
    
    public function team() {
        return $this->belongsTo(Team::class);
    }
}
