import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [clothes, setClothes] = useState("");
  const [service, setService] = useState("Wash & Fold");
  const [date, setDate] = useState("");
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");

  async function loadBookings() {
    try {
      const response = await fetch(
        "http://localhost:5000/api/bookings"
      );
      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.log("Backend is not connected yet");
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function handleBooking(e) {
    e.preventDefault();
    setMessage("");

    if (!name.trim() || !clothes.trim() || !date) {
      setMessage("Please fill all the details.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            clothes,
            service,
            date,
            status: "Pending",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Booking failed");
      }

      setMessage("Booking saved successfully!");
      setName("");
      setClothes("");
      setDate("");
      await loadBookings();
    } catch (error) {
      setMessage(
        "Server not connected. Please start the backend."
      );
    }
  }

  return (
    <div className="app">
      <nav className="navbar">
        <h2>🧺 EasyWash</h2>
        <span>Laundry Made Easy</span>
      </nav>

      <section className="hero">
        <div>
          <p className="tagline">SMART LAUNDRY SERVICE</p>
          <h1>Fresh Clothes,<br />Fresh Start.</h1>
          <p>Book your laundry service easily and save your time.</p>
          <button
            onClick={() =>
              document.getElementById("booking").scrollIntoView({
                behavior: "smooth",
              })
            }
          >
            Book Now →
          </button>
        </div>
        <div className="hero-icon">🧺</div>
      </section>

      <section className="services">
        <h2>Our Services</h2>
        <div className="service-grid">
          <div className="service-card">
            <h3>👕</h3>
            <h3>Wash & Fold</h3>
            <p>Everyday clothes cleaning</p>
          </div>
          <div className="service-card">
            <h3>🧥</h3>
            <h3>Dry Cleaning</h3>
            <p>Special garment care</p>
          </div>
          <div className="service-card">
            <h3>🩷</h3>
            <h3>Ironing</h3>
            <p>Fresh and wrinkle-free clothes</p>
          </div>
        </div>
      </section>

      <section className="booking-form" id="booking">
        <h2>Book Your Laundry</h2>
        <p>Enter your details to create a booking.</p>

        <form onSubmit={handleBooking}>
          <label>Customer Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />

          <label>Number of Clothes</label>
          <input
            type="number"
            min="1"
            value={clothes}
            onChange={(e) => setClothes(e.target.value)}
            placeholder="Enter quantity"
            required
          />

          <label>Select Service</label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option>Wash & Fold</option>
            <option>Dry Cleaning</option>
            <option>Ironing</option>
          </select>

          <label>Pickup Date</label>
          <input
            type="date"
            min={new Date().toLocaleDateString("en-CA")}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <button type="submit">Confirm Booking</button>
        </form>

        {message && <p>{message}</p>}
      </section>

      <section className="bookings">
        <h2>Your Bookings</h2>

        {bookings.length === 0 ? (
          <p>No bookings yet. Create your first booking!</p>
        ) : (
          bookings.map((booking) => (
            <div className="booking-card" key={booking._id || booking.id}>
              <h3>{booking.name}</h3>
              <p>Service: {booking.service}</p>
              <p>Clothes: {booking.clothes}</p>
              <p>Date: {booking.date}</p>
              <span className="status">
                {booking.status || "Pending"}
              </span>
            </div>
          ))
        )}
      </section>

      <footer>
        © 2026 EasyWash | Laundry Booking Management System
      </footer>
    </div>
  );
}

export default App;