<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Program extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'coordinator',
        'email'
    ];

    //public function offers(){
      //  return $this->hasMany(Offer::class);
    //}
    protected $hidden = ['pivot'];
    public function offers()
    {
        return $this->belongsToMany(Offer::class, 'offer_program');
    }
}
