export const formatCycles=(cycles)=> {
    if (cycles >= 1e9) {
        return (cycles / 1e9).toFixed(2) + 'B'; // Billion
    } else if (cycles >= 1e6) {
        return (cycles / 1e6).toFixed(2) + 'M'; // Million
    } else if (cycles >= 1e3) {
        return (cycles / 1e3).toFixed(2) + 'K'; // Thousand
    } else {
        return cycles.toString(); // Less than 1000, no formatting
    }
}