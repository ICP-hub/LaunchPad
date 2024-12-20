export const fetchWithRetry = async (fn, retries = 3, delay = 1000) => {
    try {
        return await fn();
    } catch (err) {
        if (retries === 0) throw err;
        console.warn(`Retrying... Attempts left: ${retries}`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchWithRetry(fn, retries - 1, delay);
    }
};