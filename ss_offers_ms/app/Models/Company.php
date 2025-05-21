<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'sector',
        'email',
        'city',
    ];

    public function offers()
    {
        return $this->hasMany(Offer::class);
    }
}