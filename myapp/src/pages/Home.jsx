import { useEffect, useState } from "react";
import CardItem from "../components/CardItem";

export default function Home() {
  const [items, setItems] = useState([]);

 useEffect(() => {
  fetch("https://jsonplaceholder.typicode.com/posts")
    .then((res) => res.json())
    .then((data) => setItems(data.slice(0, 9))); // sirf 9 cards
}, []);


  return (
    <div className="row g-4">
      {items.map((item) => (
        <div className="col-md-4" key={item.id}>
          <CardItem item={item} />
        </div>
      ))}
    </div>
  );
}
