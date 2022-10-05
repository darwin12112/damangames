import Page from 'components/Page';
import React,{useState,useEffect} from 'react';
import {
  Col,InputGroup,InputGroupAddon,Input,FormGroup,Label,Button,
  Row} from 'reactstrap';
import {
  FaArrowCircleLeft,FaSearch,FaKey,
  FaBars} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import Typography from '../components/Typography';
import bn from 'utils/bemnames';
const bem = bn.create('page');
const WithdrawlPage = (props) => {
  var auth=props.auth;
  const [amount,setAmount]=useState('');
  const [password,setPassword]=useState('');
  const [total,setTotal]=useState(auth.user.budget);
  const apply=()=>{
    // console.log(JSON.stringify({amount,password,bank}));
    if(amount>=10){
      (async ()=>{
        const response=await fetch("/api/withdrawl", {
          "method": "POST",
          "headers": {
            "content-type": "application/json",
            "Authorization":props.auth.userToken
  
          },
          body:JSON.stringify({amount,password,bank})
        });
        if(response.status==401)
          props.history.push('/login');
        const data=await response.json();
        if(response.status==200){
          alert(data.message);
          auth.user.budget=parseFloat(auth.user.budget)-parseFloat(amount);
          localStorage.setItem('auth',JSON.stringify(auth));
          setTotal(auth.user.budget);
        }           
        else
          alert(data.error);
      })();  
    }else{
      alert("Only more than ₹ 10 allowed!");
    }
    
  };
  const [bank,setBank]=useState(0);
  useEffect(()=>{
    if(bank=="Add Bank Card"){
      props.history.push('/bank');
    }
  },[bank]);
  return (
    <Page title={(<><Link to="/my"><Typography type="h4" className={bem.e('title')}><FaArrowCircleLeft /> Withdrawal</Typography></Link><Link color="link" to='/my/withdrawlList' style={{"padding":"20px"}}><FaBars /></Link></>)} className="MyPage"  >

      <Row>       
        <Col md={12} style={{textAlign:'center'}} className={'mt-3'}>
        <h3>Balance: ₹ {total}</h3>
        </Col> 
        <Col xl={12} lg={12} md={12}>
          <InputGroup>
            <InputGroupAddon addonType="prepend"><span className="input-group-text">₹</span></InputGroupAddon>
            <Input value={amount} type="number" max={parseFloat(auth.user.budget)}  placeholder="Enter withdrawal amount" onChange={(e)=>{setAmount(e.target.value)}}/>
          </InputGroup>
          <span style={{fontSize:'0.7rem',fontWeight:'300',marginLeft:'30px'}}>Fee {Math.floor(amount*0.03)} , to account {Math.ceil(amount*0.97)}</span>
          <FormGroup>
              <Label for="exampleSelect">Payout</Label>
              <Input type="select" value={bank} name="select" id="exampleSelect" className='form-control' onChange={(e)=>setBank(e.target.value)} >
                {
                  auth.user.bank_card.map((ele,key)=>(
                    <option key={key} value={key}>{ele.actual_name+" "+ele.bank_account}</option>
                  ))
                }
                <option>Add Bank Card</option>                
              </Input>
            </FormGroup>
            <InputGroup>
            <InputGroupAddon addonType="prepend"><span className="input-group-text"><FaKey /></span></InputGroupAddon>
            <Input value={password} type="password"  placeholder="Enter your login password" onChange={(e)=>{setPassword(e.target.value)}}/>
          </InputGroup>
        </Col>
        <Col md={12} style={{textAlign:'center'}} className={'mt-3'}>
          <Button onClick={apply} color="success"> Withdrawal </Button>
        </Col>   
        <Col md={12} style={{textAlign:'center'}} className={'mt-3'} >
            <img src='/img/bank.jfif' style={{width:'100%', maxWidth:'500px'}} />
          </Col>      
      </Row>
      <Row>
        <div style={{ "height": '60px' }}></div>
      </Row>
    </Page>
  );
};

export default WithdrawlPage 
