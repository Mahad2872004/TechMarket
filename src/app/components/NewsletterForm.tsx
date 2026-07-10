'use client';

export default function NewsletterForm() {
  return (
    <form
      className="newsletter-form"
      onSubmit={(e) => e.preventDefault()}
      aria-label="Newsletter Form"
    >
      <input
        type="email"
        placeholder="Enter your email address"
        className="newsletter-input"
        required
        id="newsletter-email"
      />
      <button type="submit" className="newsletter-btn" id="btn-subscribe">
        Subscribe Now
      </button>
    </form>
  );
}
