import Page from 'components/Page';
import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormGroup,
  Input,
  Row, Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Collapse
} from 'reactstrap';
import {
  FaSignOutAlt, FaBoxOpen,
  FaUserEdit, FaListAlt, FaCreditCard, FaShoppingBasket, FaWallet, FaBuilding, FaShieldAlt, FaDownload, FaStickyNote, FaInfoCircle
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MyPage = (props) => {

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const [isOpen1, setIsOpen1] = useState(false);
  const [nickname, setNickname] = useState({ isOpen: false, name: props.auth.user.nickname });
  const toggle1 = () => setIsOpen1(!isOpen1);
  const postNickname = () => {
    // console.log(nickname.name);
    (async () => {
      const response = await fetch("/api/nickname", {
        "method": "POST",
        "headers": {
          "content-type": "application/json",
          "Authorization": props.auth.userToken

        },
        body: JSON.stringify({
          nickname: nickname.name
        })
      });
      if (response.status == 401)
        props.history.push('/login');
      var auth = props.auth;
      auth.user.nickname = nickname.name;
      localStorage.setItem('auth', JSON.stringify(auth));
      setNickname({ ...nickname, isOpen: false });
    })();
  };
  useEffect(() => {
    (async () => {
      const response = await fetch("/api/budget", {
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "Authorization": props.auth.userToken

        }
      });
      if (response.status == 401)
        props.history.push('/login');
      const data = await response.json();
      var tmp = props.auth;
      tmp.user.budget = data.budget;
      localStorage.setItem('auth', JSON.stringify(tmp));

    })();
  }, []);
  return (
    <Page
      className="MyPage"
    >
      <Row>
        <Col xl={12} lg={12} md={12} style={{ backgroundColor: '#4d5ef8', color: 'white' }}>
          <div className="mt-2" >
            <div className="mr-3" style={{ float: "left", overflow: "hidden", width: "50px", height: "50px", borderRadius: "50px", backgroundColor: "#424242" }}>
              <div style={{ width: "50px", height: "50px", backgroundSize: 'cover', backgroundImage: "url('/img/avatar.svg')", backgroundPosition: "center center" }}></div>

            </div>
            <span className="mt-2" style={{ fontWeight: '200' }}>User: {nickname.name}</span>
            <br />
            <span style={{ fontWeight: '200' }}>ID: {props.auth.user._id}</span>
          </div>
          <div style={{ clear: 'both', padding: "0 12px", fontSize: '1.4rem' }}>Mobile: {props.auth.user.phone}</div>
          <div style={{ padding: "0 12px", fontSize: '1.4rem' }}>Available Balance: ₹{props.auth.user.budget} </div>
          <div style={{ padding: "0 12px" }}>
          <Link className={'btn btn-primary'} to="/my/recharge"  >Recharge</Link>&nbsp;
          <Button onClick={() => setNickname({ ...nickname, isOpen: true })} color="warning">Change Nick Name</Button>
          </div>
        </Col>
      </Row>
      <Row>

        <Col xl={12} lg={12} md={12}>

          {
            props.auth.user.admin ? (
              <>
                <Link className={'form-control'} color="link" to="/users"  ><FaUserEdit className='mr-3' /> Admin Users</Link>
                <Link className={'form-control'} color="link" to="/complaint-admin"  ><FaUserEdit className='mr-3' /> Admin Complaints</Link>
                <Link className={'form-control'} color="link" to="/recharge-admin"  ><FaUserEdit className='mr-3' /> Admin Recharge</Link>
                <Link className={'form-control'} color="link" to="/withdrawl-admin"  ><FaUserEdit className='mr-3' /> Admin Withdrawal</Link>
                <Link className={'form-control'} color="link" to="/reward-admin"  ><FaBoxOpen className='mr-3' /> Admin Rewards</Link>
              </>
            ) : ""
          }
          {/* <Link className={'form-control'}  color="link" to="/order"  ><FaListAlt className='mr-3' /> Order</Link> */}
          <Link className={'form-control'} color="link" to="/my/promotion"  ><FaShoppingBasket className='mr-3' /><b> Promotion</b></Link>

          <Button tag="a" className={'form-control'} color="link" onClick={toggle} style={{ marginBottom: '0rem' }}><FaWallet className="mr-3" /> Wallet</Button>
          <Collapse isOpen={isOpen}>
            <Card>
              <CardBody>
                <Link className={'form-control'} color="link" to="/my/recharge"  >Recharge</Link>
                <Link className={'form-control'} color="link" to="/my/withdrawl"  >Withdrawal</Link>
                {/* <Link className={'form-control'}  color="link" to="/transaction"  >Transaction</Link> */}
              </CardBody>
            </Card>
          </Collapse>
          <Link className={'form-control'} color="link" to="/my/bank"  ><FaCreditCard className='mr-3' /> Bank Card</Link>
          {/* <Link className={'form-control'}  color="link" to="/address"  ><FaBuilding className='mr-3' /> Address</Link> */}
          <Link className={'form-control'} color="link" to="/my/account"  ><FaShieldAlt className='mr-3' /> Acount Security</Link>
          {/* <Link className={'form-control'}  color="link" to="/app"  ><FaDownload className='mr-3' /> App Download</Link> */}
          <Link className={'form-control'} color="link" to="/my/complaint"  ><FaStickyNote className='mr-3' /> Complaints & Suggetions</Link>
          <Button tag="a" className={'form-control'} color="link" onClick={toggle1} style={{ marginBottom: '0rem' }}><FaInfoCircle className="mr-3" /> About</Button>
          <Collapse isOpen={isOpen1}>
            <Card>
              <CardBody>
                <Link className={'form-control'} color="link" to="/my/policy"  >Privacy Policy</Link>
                <Link className={'form-control'} color="link" to="/my/agreement"  >Risk Disclosure Agreement</Link>
              </CardBody>
            </Card>
          </Collapse>
          <Link className={'form-control logout'} color="link" to="/logout"  ><FaSignOutAlt className='mr-3' /> LogOut</Link>
        </Col>


      </Row>
      <Row>
        <div style={{ "height": '100px' }}></div>
      </Row>
      <Modal
        isOpen={nickname.isOpen}
        toggle={() => setNickname({ ...nickname, isOpen: false })}
      >
        <ModalHeader toggle={() => setNickname({ ...nickname, isOpen: false })}>Change Nick Name</ModalHeader>
        <ModalBody>
          <Row>
            <Col md={12}>
              <Form>
                <FormGroup>
                  <Input type="text" onChange={(e) => { setNickname({ ...nickname, name: e.target.value }) }} id="exampleSelect1" className='form-control' value={nickname.name} />

                </FormGroup>
              </Form>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={postNickname}>
            Ok
          </Button>
          <Button color="secondary" onClick={() => setNickname({ ...nickname, isOpen: false })}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </Page>
  );
};

export default MyPage;
