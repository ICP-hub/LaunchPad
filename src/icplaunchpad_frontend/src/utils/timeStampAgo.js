export default function timestampAgo(bigIntTimestamp) {
  // Ensure `bigIntTimestamp` is BigInt
  const nowInMicroseconds = BigInt(Date.now()) * 1000n;

  // Calculate the difference in microseconds
  const differenceInMicroseconds = nowInMicroseconds - bigIntTimestamp;

  // Convert the difference to seconds by dividing by 1,000,000 (microseconds in a second)
  const seconds = differenceInMicroseconds / 1_000_000n;

  return seconds; // Return the difference in seconds as BigInt
}


export function getExpirationTimeInMicroseconds(minutes) {
  // Get current time in milliseconds
  const currentTimeInMs = Date.now();

  // Add the specified number of minutes (in milliseconds)
  const expirationTimeInMs = currentTimeInMs + minutes * 60 * 1000;

  // Convert to microseconds (multiply by 1000)
  return BigInt(expirationTimeInMs * 1000);
}