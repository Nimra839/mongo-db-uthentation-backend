import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function CardItem({ item }) {
  return (
    <Card className="h-100 shadow-sm hover-zoom">
      <Card.Img
        variant="top"
        src={item.image}
        alt={item.title}
        style={{ height: "200px", objectFit: "contain" }}
      />
      <Card.Body>
        <Card.Title>{item.title.slice(0, 25)}...</Card.Title>
        <Card.Text>${item.price}</Card.Text>
        <Card.Title>{item.title}</Card.Title>
<Link to={`/detail/${item.id}`} className="btn btn-primary">
  View Details
</Link>

      </Card.Body>
    </Card>
  );
}
