export function formatDateFromBigInt(bigIntDate) {
  const date = new Date(Number(bigIntDate / 1000000n));
  const dateString = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const timeString = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
  return `${dateString} at ${timeString}`;
}


export function formatFullDateFromBigInt(bigIntDate) {
  const date = new Date(Number(bigIntDate / 1000000n));
  const dateString = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return `${dateString}`;
}

export function formatFullDateFromSimpleDate(val) {
  const date = new Date(val);
  const dateString = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  return `${dateString}`;
}


export const formatDateForDateTimeLocal = (bigIntTime) => {
  if (!bigIntTime) return;
  
  // Parse the timestamp as a BigInt
  const timestampBigInt = BigInt(bigIntTime);

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

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};


export const formatDateForDateTimeLocalPeriod = (bigIntTime) => {
  if (!bigIntTime) return;
  
  // Parse the timestamp as a BigInt
  const timestampBigInt = BigInt(bigIntTime);

  // Determine if timestamp is in seconds or nanoseconds
  const secondsTimestamp = timestampBigInt > 1_000_000_000_000n 
      ? timestampBigInt / 1_000_000_000n  // Nanoseconds to seconds
      : timestampBigInt;                  // Already in seconds

  // Convert to milliseconds and add IST offset (5 hours and 30 minutes)
  const date = new Date(Number(secondsTimestamp) * 1000 + (5 * 60 + 30) * 60 * 1000);

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  let hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  // Determine AM or PM
  const period = hours >= 12 ? 'PM' : 'AM';
  
  // Convert hours to 12-hour format
  hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  hours = String(hours).padStart(2, '0');

  return `${year}-${month}-${day}, ${hours}:${minutes} ${period}`;
};