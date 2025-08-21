import { useState } from "react";

export default function RatingStars() {
  const [rating, setRating] = useState(0);

  return (
    <div>
      <h5>Rate this product:</h5>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            cursor: "pointer",
            fontSize: "1.5rem",
            color: rating >= star ? "gold" : "gray",
          }}
          onClick={() => setRating(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
