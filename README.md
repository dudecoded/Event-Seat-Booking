deployed link:https://event-seat-booking-sigma.vercel.app/

WEbook — Event Seat Booking System

A simple event discovery and seat booking website, built for a college/society project using plain HTML, CSS, and vanilla JavaScript — no frameworks, no backend, no database. All booking data is saved locally in the browser with localStorage.



Page flow:
index.html → event.html → booking.html → bookings.html
One reusable event.html and one reusable booking.html handle every event, based on the ?event= id in the URL.

Features:

Browse events on the homepage
60 seats per event — 20 VIP (₹500), 20 Premium (₹300), 20 Regular (₹150)
Seat states: Available / Selected / Booked
Live booking summary with running total price
Filter seats by category or availability
Confirm booking, saved to localStorage
My Bookings page with cancellation (cancelled seats become available again)
Bookings persist across refreshes, per event

Built with: HTML, CSS, vanilla JavaScript, localStorage — demonstrates DOM manipulation, event listeners, arrays/objects, array methods, conditionals, and JSON.
