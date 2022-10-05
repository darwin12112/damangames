import Page from 'components/Page';
import React,{useState,useEffect} from 'react';
import {
  Button,
  Col,
  Row} from 'reactstrap';
import {
  FaArrowCircleLeft} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import Typography from '../components/Typography';
import {MdPersonPin} from 'react-icons/md';
import bn from 'utils/bemnames';
const bem = bn.create('page');
const RefererPage = (props) => {
  const [bonus,setBonus]=useState('');
  const [status,setStatus]=useState(true);
  useEffect(()=>{
    (async ()=>{
      const response=await fetch("/api/refered/"+(status ? 0 : 1), {
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "Authorization":JSON.parse(localStorage.getItem('auth')).userToken
        }
      });
      if(response.status==401)
        props.history.push('/login');
      const bonus1=await response.json();
      await setBonus(bonus1.data);
     
    })();
  },[]);
  const statusChange=ttt=>()=>{
    (async ()=>{
      const response=await fetch("/api/refered/"+(ttt ? 0 : 1), {
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "Authorization":JSON.parse(localStorage.getItem('auth')).userToken
        }
      });
      const bonus1=await response.json();
      await setBonus(bonus1.data);
     
    })();
    setStatus(ttt);
  };
  return (
    <Page title={(<Link to="/my/promotion"><Typography type="h4" className={bem.e('title')}><FaArrowCircleLeft /> Referrer</Typography></Link>)} className="MyPage"  >
      <Row style={{flexFlow: "row wrap","justifyContent": "space-between"}} className="category-bar">
        <Button className={status===true && "btn-active"} color="link" onClick={statusChange(true)}>Level 1</Button>
        <Button className={status===false && "btn-active"} color="link" onClick={statusChange(false)}>Level 2</Button>
      </Row>
      <Row>       
        
        <Col xl={12} lg={12} md={12}>
        {
          bonus && bonus.map(ele=>(
            <div style={{height:'60px',padding:'2px 5px',border:'1px solid #aaa',margin:'1px 2px',fontSize:'0.9rem'}}  className='form-control'  >
                <span style={{fontSize:'2rem'}}>
                 <MdPersonPin />
                </span>
                <span style={{fontSize:'1.2rem'}}>{ele}</span>
              </div>
          )) 
          
        }
        
        </Col>
     
        
     
        
      </Row>
      <Row>
        <div style={{ "height": '60px' }}></div>
      </Row>
    </Page>
  );
};

export default RefererPage 
