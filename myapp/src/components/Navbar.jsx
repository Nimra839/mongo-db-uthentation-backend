import { Navbar, Nav, Container, Button } from "react-bootstrap";

export default function NavbarComp({ setAuthMode, user, setUser }) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">MyApp</Navbar.Brand>
        <Nav className="ms-auto">
          {!user ? (
            <>
              <Button
                variant="outline-light"
                className="me-2"
                onClick={() => setAuthMode("login")}
              >
                Login
              </Button>
              <Button
                variant="light"
                onClick={() => setAuthMode("signup")}
              >
                Signup
              </Button>
            </>
          ) : (
            <Button
              variant="danger"
              onClick={() => setUser(null)}
            >
              Logout
            </Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
