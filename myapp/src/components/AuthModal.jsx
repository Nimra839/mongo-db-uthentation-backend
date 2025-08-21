import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";

export default function AuthModal({ mode, setMode, setUser }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "signup") {
      alert("Signup successful!");
      setMode("login"); // switch to login after signup
    } else {
      setUser({ name: formData.fullName || "User" });
      setMode(null); // close modal
    }
  };

  return (
    <Modal show onHide={() => setMode(null)}>
      <Modal.Header closeButton>
        <Modal.Title>{mode === "login" ? "Login" : "Signup"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100">
            {mode === "login" ? "Login" : "Signup"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
