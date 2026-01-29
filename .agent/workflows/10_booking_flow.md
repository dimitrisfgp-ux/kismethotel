---
description: Implement Booking Wizard Flow
---

# 10. Booking Flow

This workflow implements the booking wizard, using mock payment logic (Frontend Only).

## 10.1 Wizard Layout
- [ ] Create `/src/app/booking/page.tsx`.
- [ ] Create `/src/components/booking/WizardSteps.tsx`:
    - Horizontal stepper (active blue, completed green).

## 10.2 Step 1: Review
- [ ] Create `/src/components/booking/Step1Review.tsx`:
    - Read-only summary of Room, Dates, Total Price.

## 10.3 Step 2: Guest Details
- [ ] Create `/src/components/booking/Step2GuestDetails.tsx`:
    - form: First Name, Last Name, Email, Phone.
    - Simple HTML5 validation.

## 10.4 Step 3: Payment (Frontend Mock)
- [ ] Create `/src/components/booking/Step3Payment.tsx`:
    - **Mock Credit Card Form**: Input for Card Number, Expiry, CVC (Do not send data anywhere).
    - **Button**: "Pay €XXX" -> Click simulates API call -> Redirect to Success.
    - Note: No actual Stripe integration in this prototype phase.

## 10.5 Success Page
- [ ] Create `/src/app/booking/success/page.tsx`.
- [ ] Create `/src/components/booking/ConfirmationCard.tsx`:
    - Success message, Fake Booking ID.
