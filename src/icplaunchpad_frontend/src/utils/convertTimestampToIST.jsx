export function convertTimestampToIST(timestamp) {
    if (!timestamp) return;
  
    // Parse the timestamp as a BigInt
    const timestampBigInt = BigInt(timestamp);
  
    // Determine if timestamp is in seconds or nanoseconds
    const secondsTimestamp = timestampBigInt > 1_000_000_000_000n 
        ? timestampBigInt / 1_000_000_000n  // Nanoseconds to seconds
        : timestampBigInt;                  // Already in seconds
  
    // Convert to milliseconds and add IST offset (5 hours and 30 minutes)
    const date = new Date(Number(secondsTimestamp) * 1000 + (5 * 60 + 30) * 60 * 1000);
  
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  
    return `${year}.${month}.${day} ${hours}:${minutes} (IST)`;
  }




  export function convertTimestampToISTFormatted(timestamp) {
    if (!timestamp) return "N/A";

    const timestampBigInt = BigInt(timestamp);

    const secondsTimestamp = timestampBigInt > 1_000_000_000_000n
        ? timestampBigInt / 1_000_000_000n
        : timestampBigInt;

    const date = new Date(Number(secondsTimestamp) * 1000 + (5 * 60 + 30) * 60 * 1000);

    const year = date.getUTCFullYear();
    const monthNames = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getUTCMonth()];
    const day = date.getUTCDate();

    const daySuffix = (day) => {
        if (day % 10 === 1 && day !== 11) return `${day}st`;
        if (day % 10 === 2 && day !== 12) return `${day}nd`;
        if (day % 10 === 3 && day !== 13) return `${day}rd`;
        return `${day}th`;
    };

    return `${month} ${daySuffix(day)} ${year}`;
}