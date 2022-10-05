import Page from 'components/Page';
import React,{useState,useEffect,useRef} from 'react';
import {
  Col,InputGroup,InputGroupAddon,Input,FormGroup,Label,Button,
  Row} from 'reactstrap';
import {
  FaArrowCircleLeft,FaSearch,FaKey,
  FaBars} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import Typography from '../components/Typography';
import PageSpinner from '../components/PageSpinner';
import bn from 'utils/bemnames';
const bem = bn.create('page');
const RechargePage = (props) => {
  const btn = useRef(null);
  const [isLoading,setIsLoading]=useState(false);
  const [email,setEmail]=useState(props.auth.user.email);
  const [budget,setBudget]=useState(props.auth.user.budget);
  const [money,setMoney]=useState('');
  const [firstname,setFirstname]=useState(props.auth.user.firstname);
  const [account,setAccount]=useState('');
  const [accountItems,setAccountItems]=useState('');
  const apply=async ()=>{
      if(money=='' || email=='' || firstname==''){
        alert("Please fill out all the input");
        return;
      }
      if(money<1){
        alert("More than 100rs allowed to recharge.");
        return;
      }
      const response=await fetch("/api/recharge", {
        "method": "POST",
        "headers": {
          "content-type": "application/json",
          "Authorization":props.auth.userToken

        },
        body:JSON.stringify({money,email, firstname})
      });
      const data=await response.json();
      if(response.status==200){
        // //send razorpy website to deposit
        var ttt=props.auth;
        ttt.user.email=data.email;
        ttt.user.firstname=data.firstname;
        localStorage.setItem('auth',JSON.stringify(ttt));        
        window.location.href=`https://www.predictionmallpay.com/${data.id}/${firstname}/${data.email}/${data.money}/${data.phone}`;       
                
      }           
      else
        alert(data.error);
  };
  useEffect(() => {
    (async ()=>{
      const response=await fetch("/api/budget", {
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "Authorization":props.auth.userToken

        }
      });
      if(response.status==401)
        props.history.push('/login');
      const data=await response.json();
      var tmp=props.auth;
      tmp.user.budget=data.budget;
      localStorage.setItem('auth',JSON.stringify(tmp));
      setBudget(data.budget);
      const response1=await fetch("/static/account.json", {
        "method": "GET",
        "headers": {
          "content-type": "application/json"
        }
      });
      const data1=await response1.json();
      setAccount(data1);
      setAccountItems(Object.getOwnPropertyNames(data1));
    })();      
  },[]);
  return (
    <Page title={(<><Link to="/my"><Typography type="h4" className={bem.e('title')}><FaArrowCircleLeft /> Recharge</Typography></Link><Link color="link" to='/my/rechargeList' style={{"padding":"20px"}}><FaBars /></Link></>)} className="MyPage"  >

      <Row>       
        <Col md={12} style={{textAlign:'center'}} className={'mt-3'}>
        <h3>Balance: ₹ {budget}</h3>
        </Col> 
        
        {/* <Col xl={12} lg={12} md={12} style={{textAlign:'center'}}>
          <img src="/img/bank/bank.jpg" style={{width:'300px'}} />
        </Col> */}
        {/* <Col xl={12} lg={12} md={12} style={{padding:"0 30px"}}>
          {accountItems && accountItems.map((ele,key)=>(
            <h6 key={key}>{ele+' '}:{' '+account[ele]}</h6> 
          ))}
          <h6></h6>
        </Col> */}
        <Col xl={12} lg={12} md={12}>
          <InputGroup>
            <InputGroupAddon addonType="prepend"><span className="input-group-text">₹</span></InputGroupAddon>
            <Input value={money} type="number" max='15000' min='0' placeholder="Enter Recharge amount" onChange={(e)=>{setMoney(e.target.value)}}/>
          </InputGroup>
        </Col>
        <Col xl={12} lg={12} md={12}>
          <Button color="primary" className={'ml-3 mr-3 mt-2'} style={{width:'80px', padding:"4px 4px"}} onClick={()=>setMoney(100)} >₹ 100</Button>
          <Button color="primary" className={'ml-3 mr-3 mt-2'} style={{width:'80px', padding:"4px 4px"}} onClick={()=>setMoney(1000)} >₹ 1000</Button>
          <Button color="primary" className={'ml-3 mr-3 mt-2'} style={{width:'80px', padding:"4px 4px"}} onClick={()=>setMoney(2000)} >₹ 2000</Button>
          <Button color="primary" className={'ml-3 mr-3 mt-2'} style={{width:'80px', padding:"4px 4px"}} onClick={()=>setMoney(5000)} >₹ 5000</Button>
          <Button color="primary" className={'ml-3 mr-3 mt-2'} style={{width:'80px', padding:"4px 4px"}} onClick={()=>setMoney(10000)} >₹ 10000</Button>
          <Button color="primary" className={'ml-3 mr-3 mt-2'} style={{width:'80px', padding:"4px 4px"}} onClick={()=>setMoney(15000)} >₹ 15000</Button>
        </Col>
        <Col xl={12} lg={12} md={12}>
          <InputGroup>
            <InputGroupAddon addonType="prepend"><span className="input-group-text">First Name</span></InputGroupAddon>
            <Input value={firstname} placeholder="First Name" onChange={(e)=>{setFirstname(e.target.value)}}/>
          </InputGroup>
        </Col>
        <Col xl={12} lg={12} md={12}>
          <InputGroup>
            <InputGroupAddon addonType="prepend"><span className="input-group-text">Email</span></InputGroupAddon>
            <Input value={email} placeholder="Email" onChange={(e)=>{setEmail(e.target.value)}}/>
          </InputGroup>
        </Col>
        <Col md={12} style={{textAlign:'center'}} className={'mt-3'} >
          {!isLoading ? (
             <Button onClick={apply} color="success"> Add to Wallet </Button>
          ) : (
            <PageSpinner />
          )}
          
        </Col>    
        <Col md={12} style={{textAlign:'center'}} className={'mt-3'} >
            <img src='/img/bank.jfif' style={{width:'100%', maxWidth:'500px'}} />
          </Col>
        <div className="mt-3 col-md-12" ref={btn} style={{textAlign:'center'}}></div>

      </Row>
      <Row>
        <div style={{"height":'100px'}}></div>
      </Row>
    </Page>
  );
};

export default RechargePage 
