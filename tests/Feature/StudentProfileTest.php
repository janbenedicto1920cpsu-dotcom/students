<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StudentProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_profile_page_is_displayed_for_authenticated_user(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('student-profile.show'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('StudentProfiles/Show')
                ->where('user.email', $user->email)
                ->where('profile', null));
    }

    public function test_student_can_save_their_profile(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->put(route('student-profile.update'), [
                'name' => 'Avery Student',
                'student_number' => 'STU-2026-001',
                'middle_name' => 'Morgan',
                'birth_date' => '2005-04-12',
                'gender' => 'Prefer not to say',
                'phone' => '09123456789',
                'address' => '12 Campus Road',
                'program' => 'Information Technology',
                'year_level' => '2nd Year',
                'guardian_name' => 'Jamie Student',
                'guardian_phone' => '09112223333',
                'emergency_contact_name' => 'Jamie Student',
                'emergency_contact_phone' => '09112223333',
                'profile_summary' => 'Interested in software development.',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('student-profile.show'));

        $this->assertSame('Avery Student', $user->fresh()->name);
        $this->assertDatabaseHas('student_profiles', [
            'user_id' => $user->id,
            'student_number' => 'STU-2026-001',
            'program' => 'Information Technology',
            'year_level' => '2nd Year',
        ]);
    }

    public function test_student_number_must_be_unique(): void
    {
        $firstStudent = User::factory()->create();
        $secondStudent = User::factory()->create();
        $firstStudent->studentProfile()->create([
            'student_number' => 'STU-2026-001',
        ]);

        $this->actingAs($secondStudent)
            ->from(route('student-profile.show'))
            ->put(route('student-profile.update'), [
                'name' => $secondStudent->name,
                'student_number' => 'STU-2026-001',
            ])
            ->assertSessionHasErrors('student_number');
    }
}