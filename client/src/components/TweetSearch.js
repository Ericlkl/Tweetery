import React, { Fragment } from 'react';
import {
  Button,
  Card,
  Container,
  InputGroup,
  FormControl,
  Row,
  Col
} from 'react-bootstrap';

const SearchForm = () => {
  const onChange = e => {
    console.log(e.target.value);
  };

  // Form Group = Input
  return (
    <form>
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text id='basic-addon1'>#</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl onChange={onChange} aria-describedby='basic-addon1' />
      </InputGroup>
    </form>
  );
};

// const Suggestion = () => {
//   return (
//     <Fragment>
//       <Row className='mx-4 my-2'>
//         <Col xs={1}>Trump </Col>
//         <Col xs={1}>Trump </Col>
//         <Col xs={1}>Trump </Col>
//         <Col xs={1}>Trump </Col>
//         <Col xs={1}>Trump </Col>
//         <Col xs={1}>Trump </Col>
//         <Col xs={1}>Trump </Col>
//         <Col xs={1}>Trump </Col>
//         <Col xs={1}>Trump </Col>
//         <Col xs={1}>Trump </Col>
//       </Row>
//     </Fragment>
//   );
// };

const TweetSearch = () => {
  return (
    <Container>
      <Card className='m-1 p-5'>
        <h1 className='text-center my-3'>TweetSearch</h1>
        <SearchForm />
        <Row className='my-2'>
          <Col xs={6}>
            <Button block variant='secondary'>
              Clean
            </Button>
          </Col>
          <Col xs={6}>
            <Button block variant='primary'>
              <i class='fas fa-search'></i>Search
            </Button>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default TweetSearch;
