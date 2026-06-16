export const createBooking = async (BASE_URL, bookingData) => {
    try {
        const response = await fetch(`${BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        });

        if (!response.ok) {
            throw new Error('Booking request failed');
        }

        return await response.json();
    } catch (error) {
        if (import.meta.env.DEV) {
            console.error('Error creating booking:', error);
        }
        throw error;
    }
};

/**
 * Fetch booked (unavailable) time slots for a specific date.
 * Returns an array of time strings like ['09:00 AM', '02:00 PM']
 */
export const getBookedSlots = async (BASE_URL, date) => {
    try {
        const response = await fetch(`${BASE_URL}/bookings/slots?date=${date}`);

        if (!response.ok) {
            throw new Error('Failed to check availability');
        }

        const result = await response.json();
        return result.bookedSlots || [];
    } catch (error) {
        if (import.meta.env.DEV) {
            console.error('Error fetching booked slots:', error);
        }
        return []; // fail open — show all slots if we can't check
    }
};
