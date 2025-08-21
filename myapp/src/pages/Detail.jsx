import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import RatingStars from "../components/RatingStars";

export default function Detail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => setItem(data));
  }, [id]);

  if (!item) return <p>Loading...</p>;

  return (
    <div className="row">
      <div className="col-md-6">
        <img
          src={item.image}
          alt={item.title}
          className="img-fluid"
          style={{ maxHeight: "400px", objectFit: "contain" }}
        />
      </div>
      <div className="col-md-6">
        <h2>{item.title}</h2>
        <p>{item.description}</p>
        <h4>${item.price}</h4>
        <RatingStars />
      </div>
    </div>
  );
}
