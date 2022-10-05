import Page from 'components/Page';
import React, { useState, useEffect } from 'react';
import {
  Button,
  Col,
  Row,
  Pagination, PaginationItem, PaginationLink
} from 'reactstrap';
import {
  FaRegTired, FaFileUpload, FaHourglassHalf,
  FaArrowCircleLeft, FaRegCheckCircle, FaRegTimesCircle
} from 'react-icons/fa';
import { MdAccountBalanceWallet } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Typography from '../components/Typography';
import bn from 'utils/bemnames';
const bem = bn.create('page');
const RechargePage = (props) => {
  const [bonus, setBonus] = useState('');
  const [page, setPage] = useState(1);
  const [last, setLast] = useState(1);
  useEffect(() => {
    (async () => {
      const response = await fetch("/api/rechargeList/" + page, {
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
          setBonus(data.data);
          setPage(parseInt(data.page));
          setLast(parseInt(data.last_page));
        }

      } catch (err) {

      }
     
    })();
  }, [page]);
  return (
    <Page title={(<Link to="/my/recharge"><Typography type="h4" className={bem.e('title')}><FaArrowCircleLeft /> Recharge List</Typography></Link>)} className="MyPage"  >

      <Row>

        <Col xl={12} lg={12} md={12}>
          {bonus ?
            bonus.map(ele => (
              <div className='form-control recharge-control' title={ele.status == 0 ? 'Waiting...' : (
                ele.status == 1 ? 'Success' : ''
              )} style={{ padding: '2px 5px', border: '1px solid #aaa', margin: '1px 2px', fontSize: '0.9rem' }}>
                <span style={{ float: 'left', fontSize: '2rem' }}>
                  {ele.status == 0 ? (<MdAccountBalanceWallet style={{ color: "#ffd700" }} />) :
                    (ele.status == 1 ? (<MdAccountBalanceWallet style={{ color: "#6a82fb" }} />) : (<FaRegTimesCircle style={{ color: "red" }} />))}
                </span>

                <span className='ml-2 mt-2' style={{ fontSize: '1.1rem', fontWeight: '400' }}>₹ {ele.money} {ele.status == 1 ? 'Success' : ele.status == 0 ? 'Waiting' : "Declined"}</span>
                <br />
                <span className='ml-2'>{ele.orderID}</span>
                <br />

                <span >{ele.createdAt} </span></div>
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
        <div style={{ "height": '100px' }}></div>
      </Row>
    </Page>
  );
};

export default RechargePage 
