<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Fight extends Model {

    protected $table = 'fights';
    protected $fillable = [
        'team_id', 'against_id', 'key', 'result'
    ];
    
    public function team() {
        return $this->belongsTo(Team::class, 'team_id');
    }

    public function against() {
        return $this->belongsTo(Team::class, 'against_id');
    }

}
