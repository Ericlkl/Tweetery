import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const Header = () => {
  return (
    <Navbar className='mb-5' bg='dark' variant='dark'>
      <Container>
        <Navbar.Brand>
          EmoTweet <i class='far fa-grin'></i>
        </Navbar.Brand>

        <Nav className='inline'>
          <Nav.Link href='#home'>Home</Nav.Link>
          <Nav.Link href='#about'>About</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
