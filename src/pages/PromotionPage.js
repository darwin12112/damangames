import Page from 'components/Page';
import React,{useState, useEffect} from 'react';
import {
  Button,ButtonDropdown,DropdownToggle,DropdownMenu,DropdownItem,
  Col,
  Row} from 'reactstrap';
import {
  FaArrowCircleLeft,
  FaBars
} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import Typography from '../components/Typography';
import bn from 'utils/bemnames';
const bem = bn.create('page');

const PromotionPage = (props) => {
  const [status,setStatus]=useState(true);
  const [dropdownOpen, setOpen] = useState(false);
  const [bonus,setBonus]=useState('');
  useEffect(()=>{
    (async ()=>{
      const response=await fetch("/api/bonus/"+(status ? 0 : 10), {
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "Authorization":JSON.parse(localStorage.getItem('auth')).userToken
        }
      });
      if(response.status==401)
        props.history.push('/login');
      const bonus1=await response.json();
      await setBonus(bonus1);
     
    })();
  },[]);
  const statusChange=ttt=>()=>{
    (async ()=>{
      const response=await fetch("/api/bonus/"+(ttt ? 0 : 10), {
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "Authorization":JSON.parse(localStorage.getItem('auth')).userToken
        }
      });
      const bonus1=await response.json();
      await setBonus(bonus1);
     
    })();
    setStatus(ttt);
  };
  const apply=()=>{
    if(parseInt(bonus.total)<100)
      alert('Less than ₹ 100');
    else
      (async ()=>{
        try{
          const response=await fetch("/api/apply/"+(status ? 0 : 10), {
            "method": "post",
            "headers": {
              "content-type": "application/json",
              "Authorization":JSON.parse(localStorage.getItem('auth')).userToken
            }
          });
          await setBonus({...bonus,total:0,count:0});
        }catch(err){

        }
        
      
      })();
  }
  const toggle = () => setOpen(!dropdownOpen);
  return (
    <Page title={(<><Link to="/my"><Typography type="h4" className={bem.e('title')}><FaArrowCircleLeft /> Promotion</Typography></Link>
    <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} style={{"padding":"15px"}} >
      <DropdownToggle color={'link'}>
        <FaBars />
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem><Link to={'/my/promotionList'}>Promotions</Link></DropdownItem>
        <DropdownItem><Link to={'/my/apply'}>Applies</Link></DropdownItem>
        <DropdownItem><Link to={'/my/referers'}>Referrers</Link></DropdownItem>       
      </DropdownMenu>
    </ButtonDropdown>
    </>)} className="MyPage" 
    >
      <Row style={{flexFlow: "row wrap","justifyContent": "space-between"}} className="category-bar">
        <Button className={status===true && "btn-active"} color="link" onClick={statusChange(true)}>Level 1</Button>
        <Button className={status===false && "btn-active"} color="link" onClick={statusChange(false)}>Level 2</Button>
      </Row>

      <Row>   
        <Col md={12} style={{textAlign:'center'}} className={'mt-3'}>
          <Button onClick={apply} color="success"> Apply </Button>
        </Col> 
        <Col md={12} style={{textAlign:'center'}} className={'mt-3'}>
          <div style={{display:'inline-block'}}>Total People
          <br />
          {bonus && bonus.count}
          </div>
          <div style={{display:'inline-block'}} className={'ml-5'}>Contribution
          <br />
          ₹ {bonus && bonus.total}
          </div>
        </Col> 
        <Col md={12}  className={'mt-4 ml-3 mr-3'} >
          My Promotion Code
          <br />
          <span style={{float:'right',textDecoration:'underline'}} className={'mr-5'}>&nbsp;&nbsp;&nbsp;{bonus.ref_code}&nbsp;&nbsp;&nbsp;</span>
        </Col> 
        <Col md={12}  className={'mt-4 ml-3 mr-3'} >
          My Promotion Link
          <br />
          <span style={{float:'right',textDecoration:'underline'}} className={'mr-5'}> https://www.predictionmall.com/signup/{bonus.ref_code} </span>
        </Col> 
        <Col md={12} style={{textAlign:'center'}} className={'mt-3'}>
          <Link to={"/signup/"+bonus.ref_code} style={{fontWeight:'500'}} > Open Link </Link>
        </Col> 
      </Row>
      <Row>
        <div style={{ "height": '60px' }}></div>
      </Row>
    </Page>
  );
};

export default PromotionPage 
