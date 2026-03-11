# Frequently Asked Questions

FAQs to assist in troubleshooting common errors.

## Reservation FAQs

<details>
  <summary><strong>Why don't I receive bookings from my website?</strong></summary><br />
  <p>Your Booking Engine API (BEAPI) can only facilitate bookings that match the <a href="https://help.guesty.com/hc/en-gb/articles/9366304056605-Creating-a-Booking-Engine-API-instance-Explained#booking-options" target="_blank">booking type</a> selected in your instance settings on your dashboard. Guesty's BEAPI supports two booking types:</p>

  <ul>
    <li><strong>Booking request</strong>: This correlates with the [Create inquiry for reservation based on quote]()  endpoint and posts a request with reserved dates.</li>
    <li><strong>Instant book</strong>: This correlates with the [Create instant reservation based on quote]()  endpoint and posts a confirmed reservation.</li>
  </ul>

  <p>Please ensure your requests match the set type to avoid issues.</p>
</details>