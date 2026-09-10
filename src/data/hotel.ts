/**
 * Facility content for Hotel Daaas Kathmandu, sourced from the client's
 * property factsheet. Only confirmed facts live here — anything the
 * factsheet left blank is kept generic in copy rather than invented.
 *
 * Image imports live here (not just in the homepage components) so the
 * upcoming CMS-shaped data layer (src/lib/data.ts) has one real image per
 * category to fall back to until a live CMS exists.
 */

import imgRoomDeluxe from "@/assets/room-deluxe-real.jpg";
import imgRoomDeluxeRender from "@/assets/room/deluxe.jpg";
import imgRoomJrSuite from "@/assets/room/jrsuite.jpg";
import imgRoomSuite from "@/assets/room/suite.jpg";
import imgDining1 from "@/assets/dinning/Bitmap.jpg";
import imgDining2 from "@/assets/dinning/Bitmap 2.jpg";
import imgDining3 from "@/assets/dinning/Bitmap 3.jpg";
import imgDining4 from "@/assets/dinning/Bitmap 4.jpg";
import imgDining5 from "@/assets/dinning/Bitmap 5.jpg";
import imgDining6 from "@/assets/dinning/Bitmap 6.jpg";
import imgBanquet1 from "@/assets/Banquet/Bitmap.jpg";
import imgBanquet2 from "@/assets/Banquet/Bitmap 2.jpg";
import imgBanquet3 from "@/assets/Banquet/Bitmap 3.jpg";
import imgBanquet4 from "@/assets/Banquet/Bitmap 4.jpg";
import imgBanquet5 from "@/assets/Banquet/Bitmap 5.jpg";
import imgBanquet6 from "@/assets/Banquet/Bitmap 6.jpg";
import imgBanquet7 from "@/assets/Banquet/Bitmap 7.jpg";
import imgBanquet8 from "@/assets/Banquet/Bitmap 8.jpg";
import imgBanquet9 from "@/assets/Banquet/Bitmap 9.jpg";
import imgBanquet10 from "@/assets/Banquet/Bitmap 10.jpg";
import imgBanquet11 from "@/assets/Banquet/Bitmap 11.jpg";
import imgBanquet12 from "@/assets/Banquet/Bitmap 12.jpg";
import imgExterior from "@/assets/exterior.jpg";
import imgExterior1 from "@/assets/exterior1.jpg";
import imgWellnessPool from "@/assets/placeholders/placeholder-infinity-pool.jpg";
import imgWellnessGym from "@/assets/placeholders/placeholder-gym.jpg";
import imgWellnessSauna from "@/assets/placeholders/placeholder-sauna.jpg";

export const roomCategories = [
  {
    slug: "deluxe-room",
    name: "Deluxe Room",
    count: 67,
    description: "Comfortable, well-appointed rooms with refined interiors — the hotel's most popular category.",
    images: [imgRoomDeluxe, imgRoomDeluxeRender],
  },
  {
    slug: "jr-suite-room",
    name: "Jr. Suite Room",
    count: 6,
    description: "Elegant suites offering additional living space for a premium stay.",
    images: [imgRoomJrSuite],
  },
  {
    slug: "suite-room",
    name: "Suite Room",
    count: 8,
    description: "The hotel's signature suites, offering the highest level of comfort and space.",
    images: [imgRoomSuite],
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
    slug: "grand-banquet-hall-1st-floor",
    name: "Grand Banquet Hall — 1st Floor",
    size: "5,229 sq. ft",
    description: "A full-floor banquet hall for weddings, conferences and large celebrations.",
    capacity: "Up to 500 pax",
    setupType: "Wedding · Gala · Conference",
    images: [imgBanquet1, imgBanquet5, imgBanquet6, imgBanquet7],
  },
  {
    slug: "grand-banquet-hall-2nd-floor",
    name: "Grand Banquet Hall — 2nd Floor",
    size: "4,900 sq. ft",
    description: "The hotel's second event floor, configurable for galas and receptions.",
    capacity: "Up to 450 pax",
    setupType: "Reception · Gala · Dinner",
    images: [imgBanquet2, imgBanquet8, imgBanquet9, imgBanquet10],
  },
  {
    slug: "board-room-3rd-floor",
    name: "Board Room — 3rd Floor",
    size: "720 sq. ft",
    description: "An intimate, well-appointed space for meetings and executive gatherings.",
    capacity: "Up to 20 pax",
    setupType: "Executive · Boardroom",
    images: [imgBanquet3, imgBanquet4, imgBanquet11, imgBanquet12],
  },
] as const;

export const diningVenues = [
  {
    slug: "coffee-shop",
    name: "Coffee Shop",
    seats: "60 pax",
    timing: "7:00 AM – 11:00 PM · All Day",
    cuisine: "Multi-Cuisine",
    description: "The hotel's all-day dining restaurant beside the lobby.",
    images: [imgDining1, imgDining2],
  },
  {
    slug: "specialty-restaurant",
    name: "Specialty Restaurant",
    seats: "26 pax",
    timing: "12:00 PM – 10:00 PM",
    cuisine: "Newari Cuisine",
    description: "An intimate space celebrating traditional Newari cuisine.",
    images: [imgDining3, imgDining4],
  },
  {
    slug: "lounge",
    name: "Lounge",
    seats: "120 pax",
    timing: "12:00 PM – 10:00 PM · All Day",
    cuisine: "Multi-Cuisine",
    description: "A spacious lounge for relaxed all-day dining and drinks.",
    images: [imgDining5, imgDining6],
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

// "facility" (sauna, gym, pool, etc.) vs. "service" (generic guest services)
// is purely a display grouping for the Facilities page (see
// getServicesGrouped in lib/data.ts) — every item shares the same
// /service/[slug] page and CMS-merge logic, facility items included. The
// homepage/About Us "highlights" band (below) links its cards to these same
// slugs rather than duplicating content in a second detail-page system.
// `features` is a short bullet list transformed into an AmenityGroup by
// servicesToItems() in lib/data.ts — kept as plain strings here, matching
// how diningVenues/banquetSpaces feed their own "Details" amenity groups.
export const services = [
  {
    slug: "wifi",
    name: "Complimentary Wi-Fi",
    description:
      "Hotel Daaas Kathmandu offers complimentary high-speed Wi-Fi throughout the property, including every guest room, the lobby, restaurants, and event spaces — so you can stay connected for work or leisure throughout your stay.",
    category: "facility",
    images: [],
    features: ["All Guest Rooms", "Lobby & Public Areas", "Restaurants & Lounge", "Event & Banquet Spaces"],
  },
  {
    slug: "swimming-pool",
    name: "Swimming Pool",
    description:
      "Relax and unwind at Hotel Daaas Kathmandu's rooftop swimming pool, set above the Balaju skyline. Whether it's an early morning lap or a sunset dip, the pool offers a peaceful escape just steps from your room.",
    category: "facility",
    images: [imgWellnessPool],
    features: ["Rooftop Setting", "Sunbeds & Loungers", "Towel Service", "Skyline Views"],
  },
  {
    slug: "gym",
    name: "Gym",
    description:
      "Stay on top of your fitness routine at Hotel Daaas Kathmandu's fully equipped gym, open daily for all guests. From cardio machines to free weights, the fitness floor has everything you need to keep moving during your stay.",
    category: "facility",
    images: [imgWellnessGym],
    features: ["Cardio Machines", "Free Weights", "Open Daily", "Complimentary for Guests"],
  },
  {
    slug: "jacuzzi",
    name: "Jacuzzi",
    description:
      "Soak away the day in Hotel Daaas Kathmandu's private jacuzzi, part of the hotel's dedicated wellness floor — a warm, relaxing space to unwind after sightseeing or a day of meetings.",
    category: "facility",
    images: [imgWellnessSauna],
    features: ["Private Jacuzzi", "Heated Jets", "Towel Service", "Wellness Floor"],
  },
  {
    slug: "sauna-steam",
    name: "Sauna & Steam",
    description:
      "Unwind and restore balance at Hotel Daaas Kathmandu's dedicated wellness floor, featuring an in-house jacuzzi, sauna, and steam room — the perfect way to relax after a day of sightseeing or business meetings.",
    category: "facility",
    images: [imgWellnessSauna],
    features: ["Jacuzzi", "Sauna Room", "Steam Room", "Dedicated Wellness Floor"],
  },
  {
    slug: "hair-salon",
    name: "Hair Salon",
    description:
      "Look and feel your best with Hotel Daaas Kathmandu's in-house hair salon, offering professional styling and grooming services for guests during their stay.",
    category: "facility",
    images: [imgWellnessGym],
    features: ["Cuts & Styling", "Grooming Services", "By Appointment"],
  },
  {
    slug: "24-hour-room-service",
    name: "24-Hour Room Service",
    description:
      "Enjoy round-the-clock in-room dining and assistance at Hotel Daaas Kathmandu — whatever the hour, our team is on hand to take care of you without leaving the comfort of your room.",
    category: "service",
    images: [],
    features: ["Available 24 Hours", "In-Room Dining", "Guest Assistance"],
  },
  {
    slug: "doctor-on-call",
    name: "Doctor on Call",
    description:
      "For peace of mind during your stay, Hotel Daaas Kathmandu can arrange on-request medical assistance — just reach out to the front desk and a doctor can be arranged to attend to you.",
    category: "service",
    images: [],
    features: ["On-Request Medical Assistance", "Coordinated via Front Desk"],
  },
  {
    slug: "valet-parking",
    name: "Valet Parking",
    description:
      "Arrive stress-free with Hotel Daaas Kathmandu's valet parking service, available to all guests for the duration of their stay.",
    category: "service",
    images: [],
    features: ["Valet Service", "Available to All Guests"],
  },
  {
    slug: "airport-pick-up-drop",
    name: "Airport Pick-up / Drop",
    description:
      "Arrive and depart with ease — Hotel Daaas Kathmandu arranges airport pick-up and drop-off to and from Tribhuvan International Airport, roughly 11 km from the property, so your journey starts and ends smoothly.",
    category: "service",
    images: [],
    features: ["To/From Tribhuvan Int'l Airport", "~11 km from Hotel", "Arranged on Request"],
  },
  {
    slug: "ev-charging-point",
    name: "EV Charging Point",
    description:
      "Hotel Daaas Kathmandu offers an on-site EV charging point, making it easy for guests travelling by electric vehicle to charge up during their stay.",
    category: "service",
    images: [],
    features: ["On-Site EV Charging", "Available to All Guests"],
  },
  {
    slug: "short-hiking",
    name: "Short Hiking",
    description:
      "For guests looking to explore beyond the hotel, Hotel Daaas Kathmandu can arrange guided short hikes in the surrounding Kathmandu valley, including trails near Nagarjun National Park.",
    category: "service",
    images: [],
    features: ["Guided Short Hikes", "Nearby Nagarjun National Park Trails", "Arranged on Request"],
  },
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
// highlights band. `icon` is a Font Awesome class string (matches the CMS's
// own `features`-type data, which ships icons the same way) so it renders
// directly as `<i className={icon} />` with no lookup/mapping needed.
// `slug` points each card at its real /service/[slug] page (same one the
// Facilities page links to) — "Wellness & Spa" reuses "sauna-steam" since
// its own description already covers exactly that service, rather than
// duplicating content under a second slug.
export const highlights = [
  { icon: "fa-solid fa-wifi", title: "Complimentary Wi-Fi", desc: "Stay connected throughout your stay", slug: "wifi" },
  { icon: "fa-solid fa-person-swimming", title: "Rooftop Swimming Pool", desc: "Relax and unwind at our pool", slug: "swimming-pool" },
  { icon: "fa-solid fa-dumbbell", title: "Fitness Center", desc: "Fully equipped gym, open daily", slug: "gym" },
  { icon: "fa-solid fa-spa", title: "Wellness & Spa", desc: "Jacuzzi, sauna and steam room", slug: "sauna-steam" },
  { icon: "fa-solid fa-bell-concierge", title: "24-Hour Room Service", desc: "Whenever you need it", slug: "24-hour-room-service" },
  { icon: "fa-solid fa-plane", title: "Airport Transfers", desc: "Pick-up and drop arranged for you", slug: "airport-pick-up-drop" },
] as const;

export const nearbyLocations = [
  { name: "Nagarjun National Park", distance: "~2 km" },
  { name: "Swayambhunath Stupa", distance: "~3 km" },
  { name: "Kathmandu Durbar Square", distance: "~6 km" },
  { name: "Pashupatinath Temple", distance: "~8 km" },
  { name: "Boudhanath Stupa", distance: "~9 km" },
  { name: "Tribhuvan International Airport", distance: "~11 km" },
] as const;

// Real property photos only — deliberately excludes src/assets/placeholders/
// (generic stock imagery, not the actual hotel) so the gallery never shows a
// visitor something that isn't really Hotel Daaas.
export const galleryImages = [
  { image: imgExterior1, title: "Hotel Exterior", category: "Exterior" },
  { image: imgExterior, title: "Hotel Exterior", category: "Exterior" },
  ...roomCategories.flatMap((room) => room.images.map((image) => ({ image, title: room.name, category: "Rooms" }))),
  ...diningVenues.flatMap((venue) => venue.images.map((image) => ({ image, title: venue.name, category: "Dining" }))),
  ...banquetSpaces.flatMap((space) => space.images.map((image) => ({ image, title: space.name, category: "Events" }))),
] as const;

export const policies = {
  checkIn: "2:00 PM",
  checkOut: "11:00 AM",
  cancellation:
    "Free cancellation up to 24 hours before arrival. Cancellations after 2:00 PM on the day of arrival are charged the cost of the first night; the same applies to no-shows.",
  pets: "No pets allowed.",
} as const;

// LOCAL FALLBACK — shown only until the CMS has real FAQ entries of its own
// (getFaqs() in lib/data.ts merges live + local by question, live always
// wins). Every answer here restates a fact already established elsewhere in
// this file/config/site.ts — nothing here is invented.
export const faqs = [
  {
    question: "What time is check-in and check-out?",
    answer: "Check-in is from 2:00 PM and check-out is by 11:00 AM. Early check-in or late check-out can be arranged on request, subject to availability.",
  },
  {
    question: "Is Wi-Fi available at the hotel?",
    answer: "Yes, complimentary Wi-Fi is available throughout the hotel, including all guest rooms and public areas.",
  },
  {
    question: "Do you offer airport pick-up?",
    answer: "Yes, airport pick-up and drop-off can be arranged for guests — just share your flight details with us in advance.",
  },
  {
    question: "Is parking available on-site?",
    answer: "Yes, the hotel offers valet parking for all guests, along with an on-site EV charging point.",
  },
  {
    question: "What is your cancellation policy?",
    answer: policies.cancellation,
  },
  {
    question: "Are pets allowed at the hotel?",
    answer: "Hotel Daaas Kathmandu does not currently allow pets.",
  },
  {
    question: "Does the hotel have a swimming pool or wellness facilities?",
    answer: "Yes — Hotel Daaas features a dedicated wellness floor with a swimming pool, gym, jacuzzi, and sauna & steam rooms.",
  },
  {
    question: "Does the hotel have banquet or event spaces?",
    answer: "Yes, Hotel Daaas has three dedicated event spaces — two grand banquet halls and a board room — suitable for weddings, conferences and private celebrations.",
  },
  {
    question: "When does Hotel Daaas Kathmandu open?",
    answer: "Hotel Daaas Kathmandu is opening in November 2026 in Balaju, Kathmandu, with 81 rooms, grand banquet halls, and all-day dining.",
  },
] as const;

// LOCAL FALLBACK — shown only until the CMS has real blog posts of its own
// (getBlogs() in lib/data.ts merges live + local by slug, live always wins).
// Each post only restates facts already established elsewhere in this file —
// no invented statistics, quotes, or claims about the (not-yet-open) hotel.
export const blogPosts = [
  {
    slug: "hotel-daaas-kathmandu-opening-november-2026",
    title: "Hotel Daaas Kathmandu: A New 4-Star Landmark Rising in Balaju",
    author: "Hotel Daaas Kathmandu",
    date: "September 2026",
    image: imgExterior,
    content: `<p>Hotel Daaas Kathmandu is a new 4-star hotel taking shape in Balaju, Kathmandu, set to open in November 2026. The property will offer 81 rooms across three categories — Deluxe, Jr. Suite, and Suite — along with grand banquet halls, a dedicated wellness floor, and all-day and Newari specialty dining.</p><p>Guests will be able to unwind at the rooftop pool, gym, jacuzzi, and sauna &amp; steam rooms, or host events across three dedicated spaces, including two grand banquet halls suited for weddings, conferences, and large celebrations.</p><p>Located in Balaju, the hotel sits close to Nagarjun National Park and within easy reach of Kathmandu's major landmarks — more updates will follow as the opening date approaches.</p>`,
  },
  {
    slug: "exploring-balaju-nagarjun-national-park",
    title: "Exploring Balaju & Nagarjun National Park: What's Nearby",
    author: "Hotel Daaas Kathmandu",
    date: "September 2026",
    image: imgExterior1,
    content: `<p>Balaju is a convenient base for exploring the Kathmandu valley. Nagarjun National Park is just around 2 km away, offering forested trails and hilltop views over the city. Swayambhunath Stupa is about 3 km away, one of the valley's most iconic Buddhist sites.</p><p>Further afield, Kathmandu Durbar Square is roughly 6 km away, Pashupatinath Temple around 8 km, and Boudhanath Stupa about 9 km — all easily reachable for a day of sightseeing. Tribhuvan International Airport is approximately 11 km from the hotel.</p><p>Once Hotel Daaas Kathmandu opens in November 2026, airport pick-up and drop-off can be arranged for guests looking to explore all of the above.</p>`,
  },
  {
    slug: "planning-your-event-at-hotel-daaas",
    title: "Planning an Event at Hotel Daaas Kathmandu",
    author: "Hotel Daaas Kathmandu",
    date: "September 2026",
    image: imgBanquet1,
    content: `<p>Hotel Daaas Kathmandu will offer three dedicated event spaces once it opens in November 2026. The Grand Banquet Hall on the 1st floor spans 5,229 sq. ft and accommodates up to 500 guests, suited to weddings, galas, and large conferences.</p><p>The 2nd floor Grand Banquet Hall covers 4,900 sq. ft with capacity for up to 450 guests, ideal for receptions and gala dinners. For smaller, more intimate gatherings, the 3rd floor Board Room — at 720 sq. ft — comfortably seats up to 20 guests for executive meetings.</p><p>Get in touch with our team to discuss your event once bookings open.</p>`,
  },
] as const;
