function formatDateTime(dateString: Date) {
  const date = new Date(dateString);
  const dateTime = new Intl.DateTimeFormat("en-us", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);

  return dateTime;
}

export default formatDateTime;
