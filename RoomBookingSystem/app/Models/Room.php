<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Room extends Model
{
    protected $fillable = [
        'name',
        'description',
        'room_number',
        'max_people',
    ];

    protected $hidden = [];

    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(Group::class);
    }
}
