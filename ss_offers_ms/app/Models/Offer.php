<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Offer extends Model
{
    use HasFactory;

    protected $fillable = [
        'published_at',
        'company_id',
        'title',
        'position',
        'department',
        'schedule',
        'flex_schedule',
        'modality',
        'contract_type',
        'salary',
        'closing_date',
        'opening_date',
        'vacancies',
        'description',
        'candidate_profile',
        'notes'
    ];
    

    public function company(){
        return $this->belongsTo(Company::class);
    }

    /* public function programs(){
        return $this->hasMany(Program::class);
    } */
    public function programs()
    {
        return $this->belongsToMany(Program::class, 'offer_program');
    }
}
