import Page from 'components/Page';
import React, { useState, useEffect } from 'react';
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Pagination, PaginationItem, PaginationLink

} from 'reactstrap';
import {
  FaArrowCircleLeft,
  FaPlus, FaRegEyeSlash
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Typography from '../components/Typography';
import bn from 'utils/bemnames';
const bem = bn.create('page');
const ComplaintPage = (props) => {
  const [status, setStatus] = useState(1);
  const [list, setList] = useState([]);
  const [addData, setAddData] = useState({ state: false, whatsapp: '', period: '', category: 'Suggestion' });
  const [view, setView] = useState(-1);
  const [page, setPage] = useState(1);
  const [last, setLast] = useState(1);
  const toggle = (no) => () => {
    // console.log(list.findIndex(ele=>ele._id===no));
    (async () => {
      const response = await fetch("/api/complaints", {
        "method": "PUT",
        "headers": {
          "content-type": "application/json",
          "Authorization": JSON.parse(localStorage.getItem('auth')).userToken
        },
        body: JSON.stringify({ id: list.find(ele => ele._id === no)._id })
      });
      try {
        if (response.status < 400) {
          const data = await response.json();
          const tmp = JSON.parse(JSON.stringify(list));
          const id = list.findIndex(ele => ele._id === no);
          tmp[id].view_status = true;
          await setList(tmp);
          setView(id);
        }
      } catch (err) {
      }
    })();
  };
  const addSuggestion = () => {
    if (addData.period != '' && addData.content !== '') {
      (async () => {
        const response = await fetch("/api/complaints", {
          "method": "POST",
          "headers": {
            "content-type": "application/json",
            "Authorization": JSON.parse(localStorage.getItem('auth')).userToken

          },
          body: JSON.stringify({ ...addData })
        });
        const data = await response.json();
        alert(data.message);
        setAddData({ state: false, whatsapp: '', period: '', category: 'Suggestion' });
      })();
    }
  };
  useEffect(() => {
    (async () => {
      const response = await fetch(`/api/complaints/${status}/` + page, {
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "Authorization": JSON.parse(localStorage.getItem('auth')).userToken

        }
      });
      if (response.status == 401)
        props.history.push('/login');
      try {
        if (response.status < 400) {
          const data = await response.json();
          await setList(data.data);
          setPage(parseInt(data.page));
          setLast(parseInt(data.last_page));
        }

      } catch (err) {

      }

    })();
  }, [status, page]);
  return (
    <Page title={(<><Link to="/my"><Typography type="h4" className={bem.e('title')}><FaArrowCircleLeft /> Complaint</Typography></Link><Button color="link" onClick={() => { setAddData({ ...addData, state: true }) }} style={{ "padding": "20px" }}><FaPlus /></Button></>)} className="MyPage"
    >
      <Row style={{ flexFlow: "row wrap", "justifyContent": "space-between" }} className="category-bar">
        <Button className={status === 1 && "btn-active"} color="link" onClick={() => setStatus(1)}>Completed</Button>
        <Button className={status === 0 && "btn-active"} color="link" onClick={() => setStatus(0)}>Wait</Button>
      </Row>

      <Row>
        <Col md={12}>
          {
            (list && list.length > 0) ?
              list.map((ele, key) => (
                <Button tag="a" className={'form-control'} color="link" onClick={toggle(ele._id)} key={key} style={{ marginBottom: '0rem' }}>{ele.category}-{ele.period}
                  <span style={{ float: 'right' }}>{(ele.status == true && ele.view_status == false) ? (<FaRegEyeSlash className="text-danger" />) : ""}</span>
                </Button>
              )) : ''
          }

        </Col>

      </Row>
      <Row>
        <Col md={12}>
          <Pagination size="sm" aria-label="Page navigation example">
            {
              page > 1 ? (
                <PaginationItem>
                  <PaginationLink previous onClick={() => setPage(1)} />
                </PaginationItem>
              ) : ''
            }
            {
              page > 1 ? (
                <PaginationItem>
                  <PaginationLink onClick={() => setPage(page - 1)}>
                    {page - 1}
                  </PaginationLink>
                </PaginationItem>
              ) : ''
            }

            <PaginationItem active>
              <PaginationLink >
                {page}
              </PaginationLink>
            </PaginationItem>
            {
              page < last ? (
                <PaginationItem>
                  <PaginationLink onClick={() => setPage(page + 1)}>
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
              ) : ''
            }
            {
              page < last ? (
                <PaginationItem>
                  <PaginationLink next onClick={() => setPage(last)} />
                </PaginationItem>
              ) : ''
            }


          </Pagination>
        </Col>
      </Row>
      <Row>
        <div style={{ "height": '60px' }}></div>
      </Row>
      <Modal
        isOpen={view !== -1}
        toggle={() => setView(-1)}
      >
        <ModalHeader toggle={() => setView(-1)}>Complaint & Suggestion</ModalHeader>
        {
          (view > -1 && list[view]) ? (
            <ModalBody>
              <Row>
                <Col md={12}>
                  <Form>
                    <FormGroup>
                      <Label for="exampleSelect1">category</Label>
                      <Input type="text" disabled id="exampleSelect1" className='form-control' value={list[view].category} />

                    </FormGroup>
                    <FormGroup>
                      <Label for="period1">Period ID</Label>
                      <Input type="text" disabled value={list[view].period} name="period" id="period1" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="whatsapp1">Whatsapp Number</Label>
                      <Input type="text" disabled value={list[view].whatsapp} name="whatsapp" id="whatsapp1" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="content1">Content</Label>
                      <Input type="textarea" disabled value={list[view].content} name="content" id="content1" className='form-control' />
                    </FormGroup>
                    <FormGroup>
                      <Label for="reply">Reply</Label>
                      <Input type="textarea" disabled value={list[view].reply} name="reply" id="reply" className='form-control' />
                    </FormGroup>
                  </Form>
                </Col>
              </Row>
            </ModalBody>
          ) : ''
        }

        <ModalFooter>

          <Button color="secondary" onClick={() => setView(-1)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={addData.state}
        toggle={() => setAddData({ ...addData, state: !addData.state })}
      >
        <ModalHeader toggle={() => setAddData({ ...addData, state: !addData.state })}>Add Complaint & Suggestion</ModalHeader>
        <ModalBody>
          <Row>
            <Col md={12}>
              <Form>
                <FormGroup>
                  <Label for="exampleSelect">category</Label>
                  <Input type="select" value={addData.category} name="select" id="exampleSelect" className='form-control' onChange={(e) => setAddData({ ...addData, category: e.target.value })} >
                    <option>Suggestion</option>
                    <option>Consult</option>
                    <option>Recharge Problem</option>
                    <option>Withdraw Problem</option>
                    <option>parity Problem</option>
                    <option>Gift Receive Problem</option>
                    <option>Other</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="period">Period ID</Label>
                  <Input type="number" value={addData.period} onChange={(e) => setAddData({ ...addData, period: e.target.value })} name="period" id="period" className='form-control' />
                </FormGroup>
                <FormGroup>
                  <Label for="whatsapp">Whatsapp Number</Label>
                  <Input type="number" value={addData.whatsapp} onChange={(e) => setAddData({ ...addData, whatsapp: e.target.value })} name="whatsapp" id="whatsapp" className='form-control' />
                </FormGroup>
                <FormGroup>
                  <Label for="content">Content</Label>
                  <Input type="textarea" value={addData.content} onChange={(e) => setAddData({ ...addData, content: e.target.value })} name="content" id="content" className='form-control' />
                </FormGroup>
              </Form>
            </Col>

          </Row>

        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={addSuggestion}>
            Ok
          </Button>
          <Button color="secondary" onClick={() => setAddData({ ...addData, state: !addData.state })}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Page>
  );
};

export default ComplaintPage 
