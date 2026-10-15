import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

const inputClass = 'mt-2 w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-teal-600 focus:ring-teal-600';

function Field({ label, name, value, onChange, error, type = 'text', placeholder }) {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                id={name}
                type={type}
                value={value ?? ''}
                onChange={(event) => onChange(name, event.target.value)}
                placeholder={placeholder}
                className={inputClass}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}

function SelectField({ label, name, value, onChange, error, options }) {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <select
                id={name}
                value={value ?? ''}
                onChange={(event) => onChange(name, event.target.value)}
                className={inputClass}
            >
                <option value="">Select {label.toLowerCase()}</option>
                {options.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}

export default function Show({ user, profile, status }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name ?? '',
        student_number: profile?.student_number ?? '',
        middle_name: profile?.middle_name ?? '',
        birth_date: profile?.birth_date ?? '',
        gender: profile?.gender ?? '',
        phone: profile?.phone ?? '',
        address: profile?.address ?? '',
        program: profile?.program ?? '',
        year_level: profile?.year_level ?? '',
        guardian_name: profile?.guardian_name ?? '',
        guardian_phone: profile?.guardian_phone ?? '',
        emergency_contact_name: profile?.emergency_contact_name ?? '',
        emergency_contact_phone: profile?.emergency_contact_phone ?? '',
        profile_summary: profile?.profile_summary ?? '',
    });

    const submit = (event) => {
        event.preventDefault();
        put(route('student-profile.update'), { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <p className="text-sm font-medium text-teal-700">Student portal</p>
                    <h2 className="mt-1 text-2xl font-bold text-gray-900">My student profile</h2>
                </div>
            }
        >
            <Head title="My Student Profile" />

            <div className="min-h-screen bg-gray-50 py-10">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">Personal record</p>
                            <h1 className="mt-2 text-3xl font-bold text-gray-900">Your information, in one place.</h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                                Keep your student, contact, and emergency details current. Only you can view and update this profile.
                            </p>
                        </div>
                        <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${profile ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'}`}>
                            {profile ? 'Profile saved' : 'New profile'}
                        </span>
                    </div>

                    {status && (
                        <div role="status" className="mb-6 border-l-4 border-teal-600 bg-teal-50 px-4 py-3 text-sm text-teal-900">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-8">
                        <section className="border-b border-gray-200 pb-8">
                            <div className="mb-5">
                                <h2 className="text-lg font-semibold text-gray-900">Personal information</h2>
                                <p className="mt-1 text-sm text-gray-500">Basic details and how to reach you.</p>
                            </div>
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                <Field label="Full name" name="name" value={data.name} onChange={setData} error={errors.name} />
                                <Field label="Middle name" name="middle_name" value={data.middle_name} onChange={setData} error={errors.middle_name} />
                                <Field label="Student number" name="student_number" value={data.student_number} onChange={setData} error={errors.student_number} />
                                <Field label="Date of birth" name="birth_date" type="date" value={data.birth_date} onChange={setData} error={errors.birth_date} />
                                <SelectField label="Gender" name="gender" value={data.gender} onChange={setData} error={errors.gender} options={['Female', 'Male', 'Non-binary', 'Prefer not to say']} />
                                <Field label="Phone number" name="phone" type="tel" value={data.phone} onChange={setData} error={errors.phone} />
                                <div className="sm:col-span-2 lg:col-span-3">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Home address</label>
                                    <textarea id="address" rows="2" value={data.address} onChange={(event) => setData('address', event.target.value)} className={inputClass} />
                                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                                </div>
                            </div>
                        </section>

                        <section className="border-b border-gray-200 pb-8">
                            <div className="mb-5">
                                <h2 className="text-lg font-semibold text-gray-900">Academic information</h2>
                                <p className="mt-1 text-sm text-gray-500">Your current program and year level.</p>
                            </div>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Program or course" name="program" value={data.program} onChange={setData} error={errors.program} placeholder="e.g. Bachelor of Science in Nursing" />
                                <SelectField label="Year level" name="year_level" value={data.year_level} onChange={setData} error={errors.year_level} options={['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Graduate']} />
                            </div>
                            <div className="mt-5">
                                <label htmlFor="profile_summary" className="block text-sm font-medium text-gray-700">About me</label>
                                <textarea id="profile_summary" rows="3" maxLength="2000" value={data.profile_summary} onChange={(event) => setData('profile_summary', event.target.value)} placeholder="A short introduction (optional)" className={inputClass} />
                                {errors.profile_summary && <p className="mt-1 text-sm text-red-600">{errors.profile_summary}</p>}
                            </div>
                        </section>

                        <section className="border-b border-gray-200 pb-8">
                            <div className="mb-5">
                                <h2 className="text-lg font-semibold text-gray-900">Family and emergency contacts</h2>
                                <p className="mt-1 text-sm text-gray-500">Details to use if someone needs to reach your family.</p>
                            </div>
                            <div className="grid gap-5 sm:grid-cols-2">
                                <Field label="Parent or guardian name" name="guardian_name" value={data.guardian_name} onChange={setData} error={errors.guardian_name} />
                                <Field label="Parent or guardian phone" name="guardian_phone" type="tel" value={data.guardian_phone} onChange={setData} error={errors.guardian_phone} />
                                <Field label="Emergency contact name" name="emergency_contact_name" value={data.emergency_contact_name} onChange={setData} error={errors.emergency_contact_name} />
                                <Field label="Emergency contact phone" name="emergency_contact_phone" type="tel" value={data.emergency_contact_phone} onChange={setData} error={errors.emergency_contact_phone} />
                            </div>
                        </section>

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-gray-500">Account email: {user.email}</p>
                            <button type="submit" disabled={processing} className="rounded-md bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50">
                                {processing ? 'Saving...' : 'Save student profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}