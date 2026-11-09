export function formatDate(value, { weekday = 'short', year = false, time = false } = {}) {
  return new Intl.DateTimeFormat('en', {
    weekday,
    month: 'short',
    day: 'numeric',
    year: year ? 'numeric' : undefined,
    hour: time ? 'numeric' : undefined,
    minute: time ? '2-digit' : undefined,
  }).format(new Date(value))
}

export function toLocalDateTimeInput(value) {
  const date = new Date(value)
  const pad = (part) => String(part).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function getEventImage(event, index = 0) {
  if (event.imageUrl) return event.imageUrl
  const images = [
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80',
  ]
  return images[index % images.length]
}
