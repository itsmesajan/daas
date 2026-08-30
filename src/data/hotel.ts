/**
 * Facility content for Hotel Daaas Kathmandu, sourced from the client's
 * property factsheet. Only confirmed facts live here — anything the
 * factsheet left blank is kept generic in copy rather than invented.
 */

export const roomCategories = [
  {
    name: "Deluxe Room",
    count: 67,
    description: "Comfortable, well-appointed rooms with refined interiors — the hotel's most popular category.",
  },
  {
    name: "Jr. Suite Room",
    count: 6,
    description: "Elegant suites offering additional living space for a premium stay.",
  },
  {
    name: "Suite Room",
    count: 8,
    description: "The hotel's signature suites, offering the highest level of comfort and space.",
  },
] as const;

export const totalRooms = 81;

export const roomAmenities = [
  "Air Conditioner",
  "LED TV",
  "Toiletries",
  "Mini Bar",
  "Tea/Coffee Maker",
  "Wi-Fi",
  "Safe Deposit Locker",
] as const;

export const banquetSpaces = [
  {
    name: "Grand Banquet Hall — 1st Floor",
    size: "5,229 sq. ft",
    description: "A full-floor banquet hall for weddings, conferences and large celebrations.",
  },
  {
    name: "Grand Banquet Hall — 2nd Floor",
    size: "4,900 sq. ft",
    description: "The hotel's second event floor, configurable for galas and receptions.",
  },
  {
    name: "Board Room — 3rd Floor",
    size: "720 sq. ft",
    description: "An intimate, well-appointed space for meetings and executive gatherings.",
  },
] as const;

export const diningVenues = [
  {
    name: "Coffee Shop",
    seats: "60 pax",
    timing: "7:00 AM – 11:00 PM · All Day",
    cuisine: "Multi-Cuisine",
    description: "The hotel's all-day dining restaurant beside the lobby.",
  },
  {
    name: "Specialty Restaurant",
    seats: "26 pax",
    timing: "12:00 PM – 10:00 PM",
    cuisine: "Newari Cuisine",
    description: "An intimate space celebrating traditional Newari cuisine.",
  },
  {
    name: "Lounge",
    seats: "120 pax",
    timing: "12:00 PM – 10:00 PM · All Day",
    cuisine: "Multi-Cuisine",
    description: "A spacious lounge for relaxed all-day dining and drinks.",
  },
] as const;

export const wellnessFacilities = [
  { name: "Swimming Pool", detail: "For guests to relax and unwind" },
  { name: "Gym", detail: "Fully equipped fitness floor" },
  { name: "Jacuzzi", detail: "In-house jacuzzi" },
  { name: "Sauna & Steam", detail: "Sauna and steam rooms" },
  { name: "Hair Salon", detail: "In-house salon services" },
] as const;

export const guestServices = [
  "24-Hour Room Service",
  "Doctor on Call",
  "Valet Parking",
  "Airport Pick-up / Drop",
  "EV Charging Point",
  "Short Hiking",
] as const;

export const experiences = [
  "Hiking",
  "Adventure",
  "Cultural Experience",
  "City Safari",
  "Family Activities",
  "Water Activities",
] as const;

// Curated cross-section (rooms + wellness + service) for the "at a glance"
// highlights band — icon is a lookup key, mapped to a lucide component
// where it's rendered so this file stays free of React imports.
export const highlights = [
  { icon: "wifi", title: "Free Wi-Fi", desc: "Stay connected throughout your stay" },
  { icon: "waves", title: "Swimming Pool", desc: "Relax and unwind at our pool" },
  { icon: "dumbbell", title: "Fitness Center", desc: "Fully equipped gym, open daily" },
  { icon: "sparkles", title: "Wellness & Spa", desc: "Jacuzzi, sauna and steam room" },
  { icon: "bell", title: "24-Hour Room Service", desc: "Whenever you need it" },
  { icon: "plane", title: "Airport Transfers", desc: "Pick-up and drop arranged for you" },
] as const;

export const nearbyLocations = [
  { name: "Nagarjun National Park", distance: "~2 km" },
  { name: "Swayambhunath Stupa", distance: "~3 km" },
  { name: "Kathmandu Durbar Square", distance: "~6 km" },
  { name: "Pashupatinath Temple", distance: "~8 km" },
  { name: "Boudhanath Stupa", distance: "~9 km" },
  { name: "Tribhuvan International Airport", distance: "~11 km" },
] as const;

// PLACEHOLDER — Hotel Daaas hasn't opened yet (Nov 2026), so there are no
// real guest reviews. Swap every entry here for actual quotes pulled from
// Google/Booking.com/TripAdvisor once they exist; don't ship this as-is.
// `source` keys into the logo/label lookup in Testimonial.tsx — attribution
// is by review platform, not by name, since no real reviewer identities exist yet.
export const testimonials = [
  {
    source: "google",
    role: "Deluxe Room stay",
    quote:
      "The room was spacious and spotless, and the staff made us feel welcome from the moment we arrived. A great base for exploring Kathmandu.",
    rating: 5,
  },
  {
    source: "tripadvisor",
    role: "Jr. Suite stay",
    quote:
      "Loved the rooftop views and how quiet the room was despite being close to the city. Breakfast at the all-day restaurant was a highlight.",
    rating: 5,
  },
  {
    source: "booking",
    role: "Business stay",
    quote:
      "Booked the board room for a client meeting and everything ran smoothly — good Wi-Fi, attentive staff, and easy parking.",
    rating: 4,
  },
  {
    source: "google",
    role: "Family trip",
    quote:
      "The pool and wellness floor were perfect after a long day of sightseeing. Our kids didn't want to leave the hotel!",
    rating: 5,
  },
] as const;

export const policies = {
  checkIn: "2:00 PM",
  checkOut: "11:00 AM",
  cancellation:
    "Free cancellation up to 24 hours before arrival. Cancellations after 2:00 PM on the day of arrival are charged the cost of the first night; the same applies to no-shows.",
  pets: "No pets allowed.",
} as const;
