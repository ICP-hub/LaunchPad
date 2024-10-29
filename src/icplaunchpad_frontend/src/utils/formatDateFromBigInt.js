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
  const date = new Date(Number(bigIntTime) / 1000);

  // Format year, month, and day
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // Format hours and minutes
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};