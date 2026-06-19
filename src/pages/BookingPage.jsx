import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getTreatment } from '../api/allTreatments';
import { createBooking, getBookedSlots } from '../api/bookings';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_N8N_URL = import.meta.env.VITE_N8N_URL;

// ─── Pricing helpers ────────────────────────────────────────────────────────
const parseBasePrice = (priceStr) => {
    if (!priceStr) return null;
    const match = String(priceStr).replace(/[$\s]/g, '').match(/^([\d.]+)/);
    return match ? parseFloat(match[1]) : null;
};

const getDurationMultiplier = (duration) => {
    if (duration === '45 min') return 1.5;
    if (duration === '60 min') return 2;
    return 1;
};

const calcPrice = (priceStr, duration) => {
    const base = parseBasePrice(priceStr);
    if (base === null) return priceStr ?? 'Contact for pricing';
    const total = Math.round(base * getDurationMultiplier(duration));
    return `$${total}`;
};

// ────────────────────────────────────────────────────────────────────────────

const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM',
    '03:00 PM', '04:00 PM', '05:00 PM'
];

const stepLabels = [
    'Select Treatment',
    'Select Date & Time',
    'Enter Guest Details',
    'Review Summary'
];

const BookingPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [treatmentsList, setTreatmentsList] = useState([]);
    const [selectedTreatment, setSelectedTreatment] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [formData, setFormData] = useState({ firstname: '', lastname: '', email: '', phone: '', notes: '' });
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(null);
    const [bookedSlots, setBookedSlots] = useState([]);

    const getNextSevenDays = () => {
        const days = [];
        const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        for (let i = 1; i <= 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            days.push({
                dateStr,
                label: `${weekdayNames[d.getDay()]} ${d.getDate()}`,
                monthLabel: monthNames[d.getMonth()],
                dayName: weekdayNames[d.getDay()],
                dayOfMonth: d.getDate()
            });
        }
        return days;
    };

    const daysList = getNextSevenDays();

    useEffect(() => {
        const fetchTreatments = async () => {
            setLoading(true);
            try {
                const result = await getTreatment(API_BASE_URL, 'treatments');
                if (result && result.success && result.data && result.data.length > 0) {
                    const formatted = result.data.map((t) => ({
                        id: t._id,
                        name: t.name,
                        desc: t.description,
                        price: t.price ? `$${t.price}` : 'Contact for pricing'
                    }));
                    setTreatmentsList(formatted);
                } else {
                    setTreatmentsList([]);
                    setError("No treatments currently available.");
                }
            } catch (err) {
                console.warn("Failed to fetch treatments", err);
                setTreatmentsList([]);
                setError("We're having trouble loading treatments right now. Please refresh the page or try again shortly.");
            } finally {
                setLoading(false);
            }
        };
        fetchTreatments();
    }, []);

    const handleNextStep = () => {
        if (step === 1 && !selectedTreatment) {
            setError("Please select a treatment to continue.");
            return;
        }
        if (step === 1 && selectedTreatment && !selectedDuration) {
            setError("Please choose a session duration.");
            return;
        }
        if (step === 2 && (!selectedDate || !selectedTime)) {
            setError("Please select both a date and a time slot.");
            return;
        }
        if (step === 3) {
            if (!formData.firstname.trim()) {
                setError("Please enter your first name.");
                return;
            }
            if (!formData.lastname.trim()) {
                setError("Please enter your last name.");
                return;
            }
            if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
                setError("Please enter a valid email address.");
                return;
            }
            if (!formData.phone.trim() || formData.phone.length < 8) {
                setError("Please enter a valid phone number.");
                return;
            }
        }
        setError(null);
        setStep(prev => prev + 1);
    };

    const handlePrevStep = () => {
        setError(null);
        setStep(prev => prev - 1);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBookingSubmit = async () => {

        // Sending booking data to database
        setSubmitting(true);
        setError(null);
        let savedBooking = null;
        try {
            const bookingPayload = {
                treatment: selectedTreatment.name,
                date: selectedDate.dateStr,
                time: selectedTime,
                duration: selectedDuration,
                firstName: formData.firstname,
                lastName: formData.lastname,
                email: formData.email,
                phone: formData.phone,
                notes: formData.notes,
                price: calcPrice(selectedTreatment.price, selectedDuration)
            };

            const response = await createBooking(`${API_BASE_URL}/bookings`, bookingPayload);
            if (response && response.success) {
                savedBooking = response.data;
                setBookingSuccess(response.data);
                setStep(5);
            } else {
                throw new Error("Booking failed");
            }
        } catch (err) {
            console.error("Booking error details:", err);
            setError("Something went wrong while completing your booking. Please try again or contact us for assistance.");
        } finally {
            setSubmitting(false);
        }

        // Sending booking data to n8n (fire-and-forget — never show errors to user)
        if (savedBooking) {
            try {
                const n8nPayload = {
                    bookingId: savedBooking._id,
                    bookingStatus: savedBooking.status,
                    treatment: selectedTreatment.name,
                    date: selectedDate.dateStr,
                    time: selectedTime,
                    duration: selectedDuration,
                    firstName: formData.firstname,
                    lastname: formData.lastname,
                    email: formData.email,
                    phone: formData.phone,
                    notes: formData.notes,
                    price: savedBooking.price
                };

                await createBooking(API_N8N_URL, n8nPayload);
            } catch (err) {
                // Silently log — n8n is a secondary integration, don't affect UX
                console.warn("n8n webhook failed (non-critical):", err);
            }
        }
    };

    const formatSelectedDate = (dateObj) => {
        if (!dateObj) return "";
        const parts = dateObj.dateStr.split('-');
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="h-dvh w-screen flex flex-col bg-bg-cream overflow-hidden">

            {/* ─── Top bar ─── */}
            <header className="shrink-0 px-6 lg:px-10 py-4 flex items-center justify-between border-b border-gray-200/50 bg-white/60 backdrop-blur-sm">
                <Link to="/" className="flex items-center gap-2.5 group">
                    <img src="logo/logoicon.svg" alt="Solène logo" className="w-6 h-6" />
                    <span className="font-serif text-lg font-bold text-text-dark tracking-wide">Solène</span>
                </Link>
                <Link
                    to="/"
                    className="text-xs font-medium text-text-muted hover:text-primary transition-colors flex items-center gap-1.5"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Exit Booking
                </Link>
            </header>

            {/* ─── Main content area ─── */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

                {/* ─── Left sidebar: Progress + Summary ─── */}
                <aside className="lg:w-80 shrink-0 border-r border-gray-200/50 bg-white/40 backdrop-blur-sm overflow-y-auto hidden lg:block">
                    <div className="p-8">
                        {/* Branding / Title */}
                        <div className="mb-8">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-1.5">Schedule Your Visit</p>
                            <h1 className="text-2xl font-serif font-bold text-text-dark leading-tight">Book a Treatment</h1>
                            <p className="text-xs text-text-muted mt-2 leading-relaxed">Experience personalized, expert clinical wellness tailored just for you.</p>
                        </div>

                        {/* Step indicators */}
                        <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-4">Your Progress</h3>
                        <div className="space-y-1">
                            {stepLabels.map((label, i) => {
                                const stepNum = i + 1;
                                const isActive = step === stepNum;
                                const isCompleted = step > stepNum;
                                return (
                                    <div key={label} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary/5' : ''}`}>
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${isCompleted
                                            ? 'bg-primary text-white'
                                            : isActive
                                                ? 'bg-primary/10 text-primary ring-2 ring-primary/30'
                                                : 'bg-gray-100 text-text-muted'
                                            }`}>
                                            {isCompleted ? (
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : stepNum}
                                        </div>
                                        <span className={`text-sm font-medium transition-colors ${isActive ? 'text-text-dark' : isCompleted ? 'text-primary' : 'text-text-muted'
                                            }`}>{label}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Live selection summary */}
                        {selectedTreatment && step < 5 && (
                            <div className="mt-8 pt-6 border-t border-gray-200/60">
                                <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-4">Selection Summary</h4>
                                <div className="space-y-3 text-sm">
                                    <div className="bg-white rounded-xl p-3.5 border border-gray-100">
                                        <div className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Treatment</div>
                                        <div className="font-semibold text-text-dark mt-0.5">{selectedTreatment.name}</div>
                                    </div>
                                    {selectedDuration && (
                                        <div className="flex gap-3">
                                            <div className="flex-1 bg-white rounded-xl p-3.5 border border-gray-100">
                                                <div className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Duration</div>
                                                <div className="font-medium text-text-dark mt-0.5">{selectedDuration}</div>
                                            </div>
                                            <div className="flex-1 bg-white rounded-xl p-3.5 border border-gray-100">
                                                <div className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Price</div>
                                                <div className="font-bold text-primary text-lg mt-0.5">{calcPrice(selectedTreatment.price, selectedDuration)}</div>
                                            </div>
                                        </div>
                                    )}
                                    {selectedDate && (
                                        <div className="bg-white rounded-xl p-3.5 border border-gray-100">
                                            <div className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Date</div>
                                            <div className="font-medium text-text-dark text-xs mt-0.5">{formatSelectedDate(selectedDate)}</div>
                                        </div>
                                    )}
                                    {selectedTime && (
                                        <div className="bg-white rounded-xl p-3.5 border border-gray-100">
                                            <div className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Time</div>
                                            <div className="font-medium text-text-dark mt-0.5">{selectedTime}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* ─── Right panel: Form steps ─── */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                    {/* Mobile header (visible only on small screens) */}
                    <div className="lg:hidden shrink-0 px-6 pt-5 pb-3">
                        <h1 className="text-xl font-serif font-bold text-text-dark">Book a Treatment</h1>
                        <p className="text-xs text-text-muted mt-0.5">Step {step} of 4: {step < 5 ? stepLabels[step - 1] : 'Complete'}</p>
                    </div>

                    {/* Progress bar */}
                    {step < 5 && (
                        <div className="shrink-0 px-6 lg:px-10 pt-6 lg:pt-8 pb-2">
                            <div className="flex justify-between text-xs font-semibold text-text-muted mb-2">
                                <span>Step {step} of 4: {stepLabels[step - 1]}</span>
                                <span>{Math.round(((step - 1) / 3) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200/60 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-primary h-full transition-all duration-500 ease-out rounded-full"
                                    style={{ width: `${((step - 1) / 3) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Error Banner */}
                    {error && (
                        <div className="shrink-0 mx-6 lg:mx-10 mt-4 p-3.5 bg-red-50 border border-red-200 text-red-800 text-sm rounded-xl font-medium flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Scrollable form body */}
                    <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-6">
                        <div className="max-w-6xl">

                            {/* STEP 1: Select Treatment + Duration */}
                            {step === 1 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-serif font-semibold text-text-dark">Available Treatments</h3>
                                    {loading ? (
                                        <div className="flex flex-col items-center justify-center py-16 space-y-3">
                                            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                            <p className="text-sm text-text-muted">Loading treatment menu...</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {treatmentsList.map((t, idx) => {
                                                const isSelected = selectedTreatment?.name === t.name;
                                                return (
                                                    <div key={t.id || idx} className="flex flex-col">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedTreatment(t);
                                                                setSelectedDuration(null);
                                                                setError(null);
                                                            }}
                                                            className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex justify-between items-start gap-4 cursor-pointer hover:shadow-md ${isSelected
                                                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                                : 'border-gray-200/80 bg-white hover:border-gray-300'
                                                                }`}
                                                        >
                                                            <div className="space-y-1">
                                                                <div className="font-semibold text-text-dark flex items-center gap-2">
                                                                    {t.name}
                                                                    {isSelected && (
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                                                                    )}
                                                                </div>
                                                                <div className="text-xs text-text-muted leading-relaxed font-light line-clamp-2">{t.desc}</div>
                                                            </div>
                                                            <div className="text-right shrink-0">
                                                                <div className="text-[10px] text-text-muted font-semibold uppercase tracking-wider mb-0.5">from</div>
                                                                <div className="font-medium text-primary text-sm">{t.price}</div>
                                                                <div className="text-[10px] text-text-muted font-medium flex items-center justify-end gap-1 mt-1">
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    30 min base
                                                                </div>
                                                            </div>
                                                        </button>

                                                        {/* Duration picker — renders directly below the selected treatment */}
                                                        <div className={`duration-picker-wrapper ${isSelected ? 'duration-picker-open' : ''}`}>
                                                            <div className="mt-1.5 mx-1.5 px-3 py-2.5 bg-white/60 border border-primary/15 rounded-lg">
                                                                <h4 className="text-xs font-medium text-text-dark mb-2 flex items-center gap-1.5">
                                                                    <span className="w-0.5 h-2.5 bg-primary rounded-full"></span>
                                                                    Session Duration
                                                                </h4>
                                                                <div className="grid grid-cols-3 gap-1.5">
                                                                    {[
                                                                        { label: '30 min', desc: 'Express', icon: '⚡', multiplier: 1 },
                                                                        { label: '45 min', desc: 'Standard', icon: '✦', multiplier: 1.5 },
                                                                        { label: '60 min', desc: 'Full session', icon: '◈', multiplier: 2 },
                                                                    ].map(({ label, desc, icon, multiplier }) => {
                                                                        const base = parseBasePrice(t.price);
                                                                        const priceTag = base !== null
                                                                            ? `$${Math.round(base * multiplier)}`
                                                                            : null;
                                                                        const isDurationSelected = selectedDuration === label;
                                                                        return (
                                                                            <button
                                                                                key={label}
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setSelectedDuration(label);
                                                                                    setError(null);
                                                                                }}
                                                                                className={`py-2 px-1.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center gap-0.5 ${isDurationSelected
                                                                                    ? 'border-primary bg-primary text-white shadow-sm'
                                                                                    : 'border-gray-200 bg-white hover:border-gray-300 text-text-dark hover:bg-gray-50'
                                                                                    }`}
                                                                            >
                                                                                <span className={`text-xs leading-none ${isDurationSelected ? 'opacity-100' : 'opacity-30'
                                                                                    }`}>{icon}</span>
                                                                                <span className="font-bold text-xs">{label}</span>
                                                                                {priceTag && (
                                                                                    <span className={`text-[10px] font-bold ${isDurationSelected ? 'text-white' : 'text-primary'
                                                                                        }`}>{priceTag}</span>
                                                                                )}
                                                                                <span className={`text-[9px] font-medium leading-none ${isDurationSelected ? 'text-white/70' : 'text-text-muted'
                                                                                    }`}>{desc}</span>
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* STEP 2: Choose Date & Time */}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-base font-medium text-text-dark mb-3 flex items-center gap-2">
                                            <span className="w-1 h-3 bg-primary rounded-full"></span>
                                            1. Choose Appointment Date
                                        </h3>
                                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                            {daysList.map((day) => (
                                                <button
                                                    key={day.dateStr}
                                                    onClick={async () => {
                                                        setSelectedDate(day);
                                                        setSelectedTime(null);
                                                        setError(null);
                                                        const slots = await getBookedSlots(API_BASE_URL, day.dateStr);
                                                        setBookedSlots(slots);
                                                    }}
                                                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${selectedDate?.dateStr === day.dateStr
                                                        ? 'border-primary bg-primary text-white shadow-md'
                                                        : 'border-gray-200 bg-white hover:border-gray-300 text-text-dark'
                                                        }`}
                                                >
                                                    <div className={`text-[10px] font-bold uppercase tracking-wider ${selectedDate?.dateStr === day.dateStr ? 'text-white/80' : 'text-text-muted'
                                                        }`}>
                                                        {day.dayName}
                                                    </div>
                                                    <div className="text-lg font-bold mt-0.5">{day.dayOfMonth}</div>
                                                    <div className={`text-[9px] font-medium ${selectedDate?.dateStr === day.dateStr ? 'text-white/70' : 'text-text-muted'
                                                        }`}>
                                                        {day.monthLabel}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-base font-medium text-text-dark mb-3 flex items-center gap-2">
                                            <span className="w-1 h-3 bg-primary rounded-full"></span>
                                            2. Available Time Slots
                                        </h3>
                                        {!selectedDate ? (
                                            <div className="p-6 border border-dashed border-gray-200 rounded-xl text-center text-text-muted text-sm font-light">
                                                Please select a date above to check available hours.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-3 gap-2">
                                                {timeSlots.map((time) => {
                                                    const isBooked = bookedSlots.includes(time);
                                                    return (
                                                        <button
                                                            key={time}
                                                            disabled={isBooked}
                                                            onClick={() => {
                                                                if (!isBooked) {
                                                                    setSelectedTime(time);
                                                                    setError(null);
                                                                }
                                                            }}
                                                            className={`p-3 rounded-xl border text-center text-sm font-medium transition-all ${isBooked
                                                                ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                                                                : selectedTime === time
                                                                    ? 'border-primary bg-primary text-white shadow-md cursor-pointer'
                                                                    : 'border-gray-200 bg-white hover:border-gray-300 text-text-dark hover:bg-gray-50 cursor-pointer'
                                                                }`}
                                                        >
                                                            {time}
                                                            {isBooked && (
                                                                <span className="block text-[9px] text-red-300 font-semibold mt-0.5">Booked</span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: Enter Guest Details */}
                            {step === 3 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-serif font-semibold text-text-dark mb-2">Guest Information</h3>
                                    <div className="grid gap-4">
                                        <div>
                                            <label htmlFor="booking-first-name" className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">First Name *</label>
                                            <input
                                                type="text"
                                                id="booking-first-name"
                                                name="firstname"
                                                value={formData.firstname}
                                                onChange={handleInputChange}
                                                placeholder="John"
                                                required
                                                className="w-full p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-text-dark bg-white font-medium shadow-xs text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="booking-last-name" className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">Last Name *</label>
                                            <input
                                                type="text"
                                                id="booking-last-name"
                                                name="lastname"
                                                value={formData.lastname}
                                                onChange={handleInputChange}
                                                placeholder="Doe"
                                                required
                                                className="w-full p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-text-dark bg-white font-medium shadow-xs text-sm"
                                            />
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="booking-email" className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">Email Address *</label>
                                                <input
                                                    type="email"
                                                    id="booking-email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="jane@example.com"
                                                    required
                                                    className="w-full p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-text-dark bg-white font-medium shadow-xs text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="booking-phone" className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">Phone Number *</label>
                                                <input
                                                    type="tel"
                                                    id="booking-phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="(555) 000-0000"
                                                    required
                                                    className="w-full p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-text-dark bg-white font-medium shadow-xs text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="booking-notes" className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">Special Requests / Notes (Optional)</label>
                                            <textarea
                                                id="booking-notes"
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleInputChange}
                                                rows="3"
                                                placeholder="Let us know if you have any allergies or specific goals for this session..."
                                                className="w-full p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-text-dark bg-white font-medium shadow-xs text-sm resize-none"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 4: Review Summary */}
                            {step === 4 && (
                                <div className="space-y-5">
                                    <h3 className="text-lg font-serif font-semibold text-text-dark">Verify Appointment Details</h3>

                                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100 shadow-sm">
                                        {/* Service row */}
                                        <div className="p-5 flex justify-between items-start gap-4">
                                            <div>
                                                <div className="text-xs font-bold text-text-muted uppercase tracking-wider">Treatment</div>
                                                <div className="font-semibold text-text-dark text-base mt-0.5">{selectedTreatment?.name}</div>
                                                <div className="text-xs text-text-muted mt-1 leading-normal font-light">{selectedTreatment?.desc}</div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="font-bold text-primary text-xl">
                                                    {calcPrice(selectedTreatment?.price, selectedDuration)}
                                                </div>
                                                <div className="text-[10px] text-text-muted mt-1 font-medium">
                                                    {selectedDuration} session
                                                </div>
                                                <div className="text-[10px] text-text-muted/60 font-light">
                                                    base {selectedTreatment?.price} / 30 min
                                                </div>
                                            </div>
                                        </div>

                                        {/* DateTime + Duration row */}
                                        <div className="p-5 grid grid-cols-3 gap-4">
                                            <div>
                                                <div className="text-xs font-bold text-text-muted uppercase tracking-wider">Date</div>
                                                <div className="font-medium text-text-dark text-sm mt-0.5">{formatSelectedDate(selectedDate)}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-text-muted uppercase tracking-wider">Time</div>
                                                <div className="font-medium text-text-dark text-sm mt-0.5">{selectedTime}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-text-muted uppercase tracking-wider">Duration</div>
                                                <div className="font-medium text-text-dark text-sm mt-0.5">{selectedDuration}</div>
                                            </div>
                                        </div>

                                        {/* Guest row */}
                                        <div className="p-5 grid grid-cols-3 gap-4">
                                            <div className="col-span-1">
                                                <div className="text-xs font-bold text-text-muted uppercase tracking-wider">Guest</div>
                                                <div className="font-medium text-text-dark text-sm mt-0.5 truncate">{formData.name}</div>
                                            </div>
                                            <div className="col-span-2">
                                                <div className="text-xs font-bold text-text-muted uppercase tracking-wider">Contact Details</div>
                                                <div className="font-medium text-text-dark text-sm mt-0.5 truncate">{formData.email} • {formData.phone}</div>
                                            </div>
                                        </div>

                                        {/* Notes row */}
                                        {formData.notes && (
                                            <div className="p-5">
                                                <div className="text-xs font-bold text-text-muted uppercase tracking-wider">Special Instructions</div>
                                                <p className="text-xs text-text-muted mt-1 italic font-light leading-relaxed">"{formData.notes}"</p>
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-[11px] text-text-muted leading-relaxed text-center font-light">
                                        By clicking 'Confirm Appointment' you agree to our 24-hour cancellation policy. We look forward to welcome you at Solène.
                                    </p>
                                </div>
                            )}

                            {/* STEP 5: Success screen */}
                            {step === 5 && bookingSuccess && (
                                <div className="flex flex-col items-center justify-center text-center py-10 space-y-6">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary relative">
                                        <span className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-30"></span>
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-serif font-bold text-text-dark">Appointment Booked!</h3>
                                        <p className="text-sm text-text-muted max-w-sm mx-auto leading-relaxed">
                                            Thank you, <span className="font-semibold text-text-dark">{bookingSuccess.name}</span>. Your slot has been reserved. A confirmation email was sent to <span className="font-semibold text-text-dark">{bookingSuccess.email}</span>.
                                        </p>
                                    </div>

                                    <div className="bg-white border border-gray-200/50 rounded-2xl p-5 w-full text-left max-w-md space-y-3 shadow-xs">
                                        <div className="text-xs font-bold text-text-muted uppercase tracking-wider border-b border-gray-100 pb-2">Reservation Details</div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-text-muted">Treatment:</span>
                                            <span className="font-semibold text-text-dark">{bookingSuccess.treatment}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-text-muted">Date:</span>
                                            <span className="font-semibold text-text-dark">
                                                {formatSelectedDate({ dateStr: bookingSuccess.date })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-text-muted">Time Slot:</span>
                                            <span className="font-semibold text-text-dark">{bookingSuccess.time}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-text-muted">Duration:</span>
                                            <span className="font-semibold text-text-dark">{bookingSuccess.duration}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-text-muted">Status:</span>
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                                {bookingSuccess.status}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-text-muted font-light">
                                        If you need to make changes, please contact us or reply to the confirmation email.
                                    </p>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* ─── Footer Controls — always pinned at bottom ─── */}
                    <div 
                        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
                        className="shrink-0 px-6 lg:px-10 pt-4 border-t border-gray-200/50 bg-white/60 backdrop-blur-sm flex justify-between items-center"
                    >
                        {step === 5 ? (
                            <button
                                onClick={() => navigate('/')}
                                className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl text-center shadow-md cursor-pointer transition-colors"
                            >
                                Back to Home
                            </button>
                        ) : (
                            <>
                                {step > 1 ? (
                                    <button
                                        onClick={handlePrevStep}
                                        className="px-6 py-2.5 bg-white border border-gray-200 text-text-dark hover:bg-gray-50 font-medium rounded-xl transition-all cursor-pointer text-sm shadow-xs"
                                    >
                                        Back
                                    </button>
                                ) : (
                                    <div></div>
                                )}

                                {step === 4 ? (
                                    <button
                                        onClick={handleBookingSubmit}
                                        disabled={submitting}
                                        className={`px-8 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl shadow-md transition-all cursor-pointer text-sm ${submitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'
                                            }`}
                                    >
                                        {submitting ? 'Confirming...' : 'Confirm Appointment'}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleNextStep}
                                        className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer text-sm"
                                    >
                                        Continue
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
