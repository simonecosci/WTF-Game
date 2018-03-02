<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Team extends Model {

    protected $table = 'teams';
    protected $fillable = [
        'user_id', 'name', 'played', 'won', 'members'
    ];
    
    public function teammembers() {
        return $this->hasMany(TeamMember::class);
    }

}
