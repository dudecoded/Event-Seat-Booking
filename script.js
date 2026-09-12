/* =========================================================
   WEBOOK - EVENT SEAT BOOKING SYSTEM
   Plain HTML + CSS + vanilla JavaScript + localStorage
   =========================================================
   This one file runs on every page (index, event, booking,
   bookings). Each section below checks "does this page have
   the element I need?" before it runs, so nothing crashes on
   pages that don't have that element.
   ========================================================= */


/* ---------- 1. EVENT DATA ----------
   One simple array of objects. Add a new event by adding a
   new object here - no other file needs to change. */

const events = [
    {
        id: "melody",
        name: "Melody Nights",
        category: "CONCERT",
        date: "15 November 2026",
        time: "7:00 PM",
        location: "Lucknow",
        image: "images/concert.jpg",
        description: "Experience an unforgettable night of live music, amazing performances and great energy."
    },
    {
        id: "basketball",
        name: "Basketball Showdown",
        category: "SPORTS",
        date: "22 November 2026",
        time: "6:00 PM",
        location: "Delhi",
        image: "images/sports.jpg",
        description: "Watch two top teams battle it out in a high-energy basketball showdown."
    },
    {
        id: "comedy",
        name: "Comedy Live",
        category: "COMEDY",
        date: "28 November 2026",
        time: "8:00 PM",
        location: "Noida",
        image: "images/comedy.jpg",
        description: "A night full of laughter with some of the funniest stand-up comedians around."
    }
];

// Every event uses the same 3 ticket categories and the same
// seat layout: seats 1-20 = VIP, 21-40 = Premium, 41-60 = Regular.
const seatCategories = [
    { category: "VIP", price: 500 },
    { category: "Premium", price: 300 },
    { category: "Regular", price: 150 }
];


/* ---------- 2. SMALL HELPER FUNCTIONS ---------- */

// Reads a value from the page URL, e.g. booking.html?event=melody
// getQueryParam("event") returns "melody"
function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

// Bookings are stored in localStorage as ONE object, keyed by event id:
// { "melody": [1, 2, 3], "comedy": [45, 46] }
// This lets us track bookings separately per event.
function getAllBookings() {
    const stored = localStorage.getItem("webookBookings");
    return stored ? JSON.parse(stored) : {};
}

function saveAllBookings(bookings) {
    localStorage.setItem("webookBookings", JSON.stringify(bookings));
}

// Works out the ticket price for a given seat number
function getSeatPrice(seatId) {
    if (seatId <= 20) return 500;      // VIP
    if (seatId <= 40) return 300;      // Premium
    return 150;                        // Regular
}

function getSeatCategory(seatId) {
    if (seatId <= 20) return "VIP";
    if (seatId <= 40) return "Premium";
    return "Regular";
}


/* =========================================================
   3. EVENT PAGE (event.html)
   Fills in the event details based on ?event= in the URL.
   ========================================================= */

const eventNameElement = document.getElementById("event-name");

if (eventNameElement) {

    const eventId = getQueryParam("event");
    const currentEvent = events.find(e => e.id === eventId) || events[0];

    document.getElementById("event-image").src = currentEvent.image;
    document.getElementById("event-image").alt = currentEvent.name;
    document.getElementById("event-category-label").textContent = currentEvent.category;
    eventNameElement.textContent = currentEvent.name;
    document.getElementById("event-description").textContent = currentEvent.description;
    document.getElementById("event-date").textContent = currentEvent.date;
    document.getElementById("event-time").textContent = currentEvent.time;
    document.getElementById("event-location").textContent = currentEvent.location;

    // Send the event id along to the booking page
    const selectSeatsBtn = document.getElementById("select-seats-btn");
    selectSeatsBtn.addEventListener("click", function () {
        window.location.href = "booking.html?event=" + currentEvent.id;
    });
}


/* =========================================================
   4. BOOKING PAGE (booking.html) - seat selection
   ========================================================= */

const seatContainer = document.getElementById("seat-container");

if (seatContainer) {

    const eventId = getQueryParam("event");
    const currentEvent = events.find(e => e.id === eventId) || events[0];

    document.getElementById("booking-event-name").textContent = currentEvent.name;
    document.getElementById("booking-event-meta").textContent =
        currentEvent.date + " • " + currentEvent.location;

    // Load only THIS event's booked seats
    const allBookings = getAllBookings();
    let bookedSeats = allBookings[currentEvent.id] || [];

    let selectedSeats = [];

    const selectedSeatsElement = document.getElementById("selected-seats");
    const seatCountElement = document.getElementById("seat-count");
    const totalPriceElement = document.getElementById("total-price");
    const confirmButton = document.getElementById("confirm-booking");

    // ---- 4a. Create 60 seat buttons ----
    for (let i = 1; i <= 60; i++) {

        const seat = document.createElement("button");
        seat.classList.add("seat");
        seat.textContent = i;
        seat.dataset.id = i;
        seat.dataset.category = getSeatCategory(i);
        seat.dataset.price = getSeatPrice(i);

        if (bookedSeats.includes(i)) {
            seat.classList.add("booked");
        }

        seat.addEventListener("click", function () {

            if (seat.classList.contains("booked")) {
                return; // can't select an already booked seat
            }

            const seatId = Number(seat.dataset.id);

            if (seat.classList.contains("selected")) {
                seat.classList.remove("selected");
                selectedSeats = selectedSeats.filter(id => id !== seatId);
            } else {
                seat.classList.add("selected");
                selectedSeats.push(seatId);
            }

            updateSummary();
        });

        seatContainer.appendChild(seat);
    }

    // ---- 4b. Booking summary (selected seats + total price) ----
    function updateSummary() {

        if (selectedSeats.length === 0) {
            selectedSeatsElement.textContent = "No seats selected";
            seatCountElement.textContent = 0;
            totalPriceElement.textContent = "₹0";
            return;
        }

        selectedSeatsElement.textContent = selectedSeats.join(", ");
        seatCountElement.textContent = selectedSeats.length;

        let total = 0;
        selectedSeats.forEach(id => {
            total += getSeatPrice(id);
        });

        totalPriceElement.textContent = "₹" + total;
    }

    // ---- 4c. Capacity info per category (e.g. "VIP: 14/20 available") ----
    function updateCapacity() {
        seatCategories.forEach(cat => {

            const seatsInCategory = document.querySelectorAll(
                '.seat[data-category="' + cat.category + '"]'
            );

            const bookedInCategory = document.querySelectorAll(
                '.seat[data-category="' + cat.category + '"].booked'
            );

            const total = seatsInCategory.length;
            const available = total - bookedInCategory.length;

            const label = document.getElementById(cat.category.toLowerCase() + "-capacity");
            if (label) {
                label.textContent = cat.category + ": " + available + "/" + total + " available";
            }
        });
    }

    updateCapacity();

    // ---- 4d. Filters: by category and by availability ----
    let showAvailableOnly = false;
    const categoryFilterButtons = document.querySelectorAll(".filter-btn[data-filter]");
    const availableOnlyBtn = document.getElementById("available-only-btn");

    categoryFilterButtons.forEach(button => {
        button.addEventListener("click", function () {
            categoryFilterButtons.forEach(b => b.classList.remove("active"));
            button.classList.add("active");
            applyFilters();
        });
    });

    availableOnlyBtn.addEventListener("click", function () {
        showAvailableOnly = !showAvailableOnly;
        availableOnlyBtn.classList.toggle("active", showAvailableOnly);
        applyFilters();
    });

    function applyFilters() {

        const activeButton = document.querySelector(".filter-btn[data-filter].active");
        const selectedCategory = activeButton.dataset.filter; // "all", "VIP", "Premium" or "Regular"

        const allSeats = document.querySelectorAll(".seat");

        allSeats.forEach(seat => {

            const matchesCategory =
                selectedCategory === "all" || seat.dataset.category === selectedCategory;

            const matchesAvailability =
                !showAvailableOnly || !seat.classList.contains("booked");

            if (matchesCategory && matchesAvailability) {
                seat.classList.remove("filtered-out");
            } else {
                seat.classList.add("filtered-out");
            }
        });
    }

    // ---- 4e. Confirm booking ----
    confirmButton.addEventListener("click", function () {

        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }

        bookedSeats = bookedSeats.concat(selectedSeats);
        allBookings[currentEvent.id] = bookedSeats;
        saveAllBookings(allBookings);

        alert("Booking confirmed!");
        window.location.href = "bookings.html";
    });
}


/* =========================================================
   5. MY BOOKINGS PAGE (bookings.html)
   ========================================================= */

const bookingList = document.getElementById("booking-list");

if (bookingList) {

    const allBookings = getAllBookings();

    // Only keep events that actually have seats booked
    const bookedEventIds = Object.keys(allBookings).filter(
        id => allBookings[id].length > 0
    );

    if (bookedEventIds.length === 0) {

        bookingList.innerHTML =
            '<p class="no-bookings">You don\'t have any bookings yet.</p>';

    } else {

        bookingList.innerHTML = ""; // clear it first

        bookedEventIds.forEach(eventId => {

            const eventInfo = events.find(e => e.id === eventId);
            const seats = allBookings[eventId];

            let total = 0;
            seats.forEach(seatId => {
                total += getSeatPrice(seatId);
            });

            const card = document.createElement("div");
            card.classList.add("booking-card");

            card.innerHTML =
                "<h2>" + eventInfo.name + "</h2>" +
                "<p>📅 " + eventInfo.date + "</p>" +
                "<p>📍 " + eventInfo.location + "</p>" +
                "<p>Seats: " + seats.join(", ") + "</p>" +
                "<p>Total: ₹" + total + "</p>" +
                "<p>Status: Confirmed</p>" +
                '<button class="cancel-btn" data-event="' + eventId + '">Cancel Booking</button>';

            bookingList.appendChild(card);
        });

        // Attach a cancel handler to every cancel button
        document.querySelectorAll(".cancel-btn").forEach(button => {

            button.addEventListener("click", function () {

                const eventId = button.dataset.event;

                delete allBookings[eventId]; // frees up all its seats
                saveAllBookings(allBookings);

                alert("Booking cancelled.");
                location.reload();
            });
        });
    }
}
