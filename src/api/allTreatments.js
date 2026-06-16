const getTreatment = async (BASE_URL, endpoint) => {
    try {
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load data');
        }

        return await response.json();
    } catch (error) {
        if (import.meta.env.DEV) {
            console.error('Error getting data:', error);
        }
        throw error;
    }
}

export { getTreatment };