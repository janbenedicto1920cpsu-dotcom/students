<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'student_number',
    'middle_name',
    'birth_date',
    'gender',
    'phone',
    'address',
    'program',
    'year_level',
    'guardian_name',
    'guardian_phone',
    'emergency_contact_name',
    'emergency_contact_phone',
    'profile_summary',
])]
class StudentProfile extends Model
{
    protected function casts(): array
    {
        return [
            'birth_date' => 'date:Y-m-d',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}