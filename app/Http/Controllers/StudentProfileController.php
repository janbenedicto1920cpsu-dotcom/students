<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class StudentProfileController extends Controller
{
    public function show(Request $request): Response
    {
        return Inertia::render('StudentProfiles/Show', [
            'user' => $request->user()->only('name', 'email'),
            'profile' => $request->user()->studentProfile,
            'status' => session('status'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $profile = $request->user()->studentProfile;
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'student_number' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('student_profiles', 'student_number')->ignore($profile?->id),
            ],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'birth_date' => ['nullable', 'date', 'before_or_equal:today'],
            'gender' => ['nullable', Rule::in(['Female', 'Male', 'Non-binary', 'Prefer not to say'])],
            'phone' => ['nullable', 'string', 'max:40'],
            'address' => ['nullable', 'string', 'max:2000'],
            'program' => ['nullable', 'string', 'max:255'],
            'year_level' => ['nullable', Rule::in(['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Graduate'])],
            'guardian_name' => ['nullable', 'string', 'max:255'],
            'guardian_phone' => ['nullable', 'string', 'max:40'],
            'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:40'],
            'profile_summary' => ['nullable', 'string', 'max:2000'],
        ]);

        $request->user()->update(['name' => $validated['name']]);
        unset($validated['name']);

        $request->user()->studentProfile()->updateOrCreate([], $validated);

        return redirect()
            ->route('student-profile.show')
            ->with('status', 'Student profile saved.');
    }
}