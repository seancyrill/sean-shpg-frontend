export function timeStampToLocal(timestamp: string) {
  // Convert ISOString to Date object
  const toConvert = new Date(timestamp);

  // Get components of the local date
  const year = toConvert.getFullYear();
  const month = String(toConvert.getMonth() + 1).padStart(2, "0");
  const day = String(toConvert.getDate()).padStart(2, "0");
  const hours = String(toConvert.getHours()).padStart(2, "0");
  const minutes = String(toConvert.getMinutes()).padStart(2, "0");
  const seconds = String(toConvert.getSeconds()).padStart(2, "0");

  // Create the timestamp string in your desired format
  const localDate = `${year}-${month}-${day}`;
  const localTime = `${hours}:${minutes}:${seconds}`;
  return { localDate, localTime };
}
