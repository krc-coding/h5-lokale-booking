<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    protected $fillable = [
        'name',
        'description',
        'room_number',
        'max_people',
    ];

    protected $hidden = [];

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(Group::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
