import React from 'react';
import PageSpinner from '../components/PageSpinner';
import { Redirect, Link } from 'react-router-dom';
import { stateSetter } from '../components/Service';
import {
  Row,
  Col,
  Button,
  Card,
  CardHeader,
  CardBody,
  Table,
  Modal,
  ModalBody,
  ModalFooter, ButtonGroup,
  ModalHeader, Pagination, PaginationItem, PaginationLink
} from 'reactstrap';
import Page from 'components/Page';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';

import {
  FaSyncAlt,
  FaTrophy,
  FaInfoCircle
} from 'react-icons/fa';
import {

  MdWarning
} from 'react-icons/md';
var timeOut;
class EnjoyPage extends React.Component {
  constructor(props) {
    super(props);
    this.setter = stateSetter(this);
    console.log(props.location.state);
  }
  componentWillUnmount() {
    this.setter.cancel();
    clearTimeout(timeOut);

  }
  state = {
    // data:[
    //   {
    //     records:'',
    //     bet:'',
    //     time:'',
    //     status:0,
    //     getReult:false,
    //     modal: false,
    //     contract_money:10,
    //     guess:'',
    //     redirectToLogin:false,
    //     my_records:''
    //   },
    //   {
    //     records:'',
    //     bet:'',
    //     time:'',
    //     status:0,
    //     getReult:false,
    //     modal: false,
    //     contract_money:10,
    //     guess:'',
    //     redirectToLogin:false,
    //     my_records:''
    //   },
    //   {
    //     records:'',
    //     bet:'',
    //     time:'',
    //     status:0,
    //     getReult:false,
    //     modal: false,
    //     contract_money:10,
    //     guess:'',
    //     redirectToLogin:false,
    //     my_records:''
    //   },
    //   {
    //     records:'',
    //     bet:'',
    //     time:'',
    //     status:0,
    //     getReult:false,
    //     modal: false,
    //     contract_money:10,
    //     guess:'',
    //     redirectToLogin:false,
    //     my_records:''
    //   }
    // ],
    log_time: '',
    time: '',
    bet: [0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
    number: '',
    price: '',
    contract: '',
    modal: false,
    level: 0,
    redirectToLogin: false,
    records: '',
    my_records: '',
    contract_no: '',
    records_page: 1,
    last_records_page: 1,
    records_my_page: 1,
    last_records_my_page: 1,
    pre_contract: 10,
    reload: false,
    readModal: false,
    status: true

  };
  componentDidMount() {
    // fetch('/json/message',{
    //   "method": "GET",
    //   "headers": {
    //     "content-type": "application/json",
    //     "Authorization":this.props.auth.userToken
    //   }
    // }).then(response =>{ 
    //   if(response.status<400){
    //     response.json().then(res=>{
    //       // console.log(res);
    //       this.notificationSystem.addNotification({
    //         title: <div><FaInfoCircle />{" "+res.title}</div>,

    //         message:(
    //           <div>
    //             {res.content}
    //           </div>
    //         ),
    //         level: 'success',
    //       });

    //     });

    //   }else{
    //     this.setter.setState({
    //       redirectToLogin:true
    //     })
    //   }

    // });
    fetch("/api/enjoy/" + this.state.level, {
      "method": "GET",
      "headers": {
        "content-type": "application/json",
        "Authorization": this.props.auth.userToken
      }
    })
      .then(response => {
        if (response.status < 400) {
          response.json().then(res => {
            // console.log(res);
            clearTimeout(timeOut);
            timeOut = setTimeout(this.onTimeDecrease, 1000);
            this.props.auth.user.budget = res.balance ? res.balance : this.props.auth.user.budget;
            localStorage.setItem('auth', JSON.stringify(this.props.auth));
            if (res.time > 150000) {
              this.setter.setState({
                log_time: res.log_time,
                bet: res.bet,
                price: res.price ? res.price : this.state.price,
                records: res.records,
                my_records: res.my_records,
                number: res.number ? res.number : this.state.number,
                contract: res.contract ? res.contract : this.state.contract,
                time: 180000 - parseInt(res.time),
                records_my_page: parseInt(res.records_my_page),
                last_records_my_page: parseInt(res.last_records_my_page),
                records_page: parseInt(res.records_page),
                last_records_page: parseInt(res.last_records_page)
              });

            } else {
              this.setter.setState({
                log_time: res.log_time,
                bet: res.bet,
                records: res.records,
                my_records: res.my_records,
                time: 180000 - parseInt(res.time),
                records_my_page: parseInt(res.records_my_page),
                last_records_my_page: parseInt(res.last_records_my_page),
                records_page: parseInt(res.records_page),
                last_records_page: parseInt(res.last_records_page)
              });
            }

          });

        } else {
          this.setter.setState({
            redirectToLogin: true
          })
        }

      });

  }

  onTimeDecrease = () => {
    clearTimeout(timeOut);
    timeOut = setTimeout(this.onTimeDecrease, 1000);
    this.setter.setState({
      time: this.state.time - 1000
    });
    if (this.state.time < 2000 && this.state.time > 0) {
      fetch("/api/enjoy/" + this.state.level, {
        "method": "GET",
        "headers": {
          "content-type": "application/json",
          "Authorization": this.props.auth.userToken
        }
      })
        .then(response => {
          if (response.status < 400) {
            response.json().then(res => {
              // console.log(res);
              this.props.auth.user.budget = res.balance ? res.balance : this.props.auth.user.budget;
              localStorage.setItem('auth', JSON.stringify(this.props.auth));
              if (res.time > 150000) {
                this.setter.setState({
                  log_time: res.log_time,
                  bet: res.bet,
                  price: res.price ? res.price : this.state.price,
                  records: res.records,
                  my_records: res.my_records,
                  number: res.number ? res.number : this.state.number,
                  contract: res.contract ? res.contract : this.state.contract,
                  time: 180000 - parseInt(res.time),
                  records_my_page: parseInt(res.records_my_page),
                  last_records_my_page: parseInt(res.last_records_my_page),
                  records_page: parseInt(res.records_page),
                  last_records_page: parseInt(res.last_records_page)

                });
              } else {
                this.setter.setState({
                  log_time: res.log_time,
                  bet: res.bet,
                  price: res.price ? res.price : this.state.price,
                  records: res.records,
                  my_records: res.my_records,
                  number: res.number ? res.number : this.state.number,
                  contract: res.contract ? res.contract : this.state.contract,
                  time: 180000 - parseInt(res.time),
                  records_my_page: parseInt(res.records_my_page),
                  last_records_my_page: parseInt(res.last_records_my_page),
                  records_page: parseInt(res.records_page),
                  last_records_page: parseInt(res.last_records_page)
                });
              }

            });

          } else {
            this.setter.setState({
              redirectToLogin: true
            })
          }

        });
    } else if (this.state.time < 0) {
        fetch("/api/enjoy/" + this.state.level, {
          "method": "GET",
          "headers": {
            "content-type": "application/json",
            "Authorization": this.props.auth.userToken
          }
        })
          .then(response => {
            if (response.status < 400) {
              response.json().then(res => {
                // console.log(res);
                this.props.auth.user.budget = res.balance ? res.balance : this.props.auth.user.budget;
                localStorage.setItem('auth', JSON.stringify(this.props.auth));
                if (res.time > 150000) {
                  // this.setter.setState({
                  //   log_time:res.log_time,
                  //   bet:res.bet,
                  //   price:res.price,
                  //   records:res.records,
                  //   my_records:res.my_records,
                  //   number:res.number,
                  //   contract:res.contract,
                  //   time:180000-parseInt(res.time),
                  //   records_my_page:parseInt(res.records_my_page),
                  //   last_records_my_page:parseInt(res.last_records_my_page),
                  //   records_page:parseInt(res.records_page),
                  //   last_records_page:parseInt(res.last_records_page),
                  //   status:true

                  // });                              
                } else {
                  this.setter.setState({
                    log_time: res.log_time,
                    bet: res.bet,
                    price: res.price ? res.price : this.state.price,
                    records: res.records,
                    my_records: res.my_records,
                    number: res.number ? res.number : this.state.number,
                    contract: res.contract ? res.contract : this.state.contract,
                    time: 180000 - parseInt(res.time),
                    records_my_page: parseInt(res.records_my_page),
                    last_records_my_page: parseInt(res.last_records_my_page),
                    records_page: parseInt(res.records_page),
                    last_records_page: parseInt(res.last_records_page),
                    status: true
                  });
                }

                this.notificationSystem.addNotification({
                  title: <FaTrophy />,
                  message: (
                    <div>
                      parity :
                      <br />
                      &nbsp;{' '}Result {this.state.number[0]}
                      <br />
                      &nbsp;{' '}Price: {this.state.price[0]}
                      <br />
                      &nbsp;{' '}Contract Money: {this.state.contract[0]}
                      <br />
                    Sapre:
                      <br />
                    &nbsp;{' '}Result {this.state.number[1]}
                      <br />
                      &nbsp;{' '}Price: {this.state.price[1]}
                      <br />
                      &nbsp;{' '}Contract Money: {this.state.contract[1]}
                      <br />
                    Bcone :
                      <br />
                    &nbsp;{' '}Result {this.state.number[2]}
                      <br />
                      &nbsp;{' '}Price: {this.state.price[2]}
                      <br />
                      &nbsp;{' '}Contract Money: {this.state.contract[2]}
                      <br />
                    Emerd:
                      <br />
                    &nbsp;{' '}Result {this.state.number[3]}
                      <br />
                      &nbsp;{' '}Price: {this.state.price[3]}
                      <br />
                      &nbsp;{' '}Contract Money: {this.state.contract[3]}
                    </div>
                  ),
                  level: 'info',
                });

              });

            } else {
              this.setter.setState({
                redirectToLogin: true
              })
            }

          });
    }


  }

  onButtonClick = num => () => {
    this.setter.setState({
      contract_no: num,
      pre_contract: 10
    });
    // console.log(num);
    return this.toggle()();
  };
  toggle = modalType => () => {
    if (!modalType) {
      return this.setter.setState({
        modal: !this.state.modal,
      });
    }
  };
  toggleRead = modalType => () => {
    if (!modalType) {
      return this.setter.setState({
        readModal: !this.state.readModal,
      });
    }
  };
  onContractChange = num => () => {
    //////////////////////////////////////////////

    if (num === "+") {
      //if(this.state.pre_contract>=10 && this.state.pre_contract<100){
      //  if(parseInt(this.refs.contract.innerHTML)<3){
      //    this.refs.contract.innerHTML=3;
      //    return;
      //  }
      //}
      if (this.refs.contract.innerHTML === '9')
        return;
      this.refs.contract.innerHTML = parseInt(this.refs.contract.innerHTML) + 1;
    } else if (num === "-") {
      //if(this.state.pre_contract>=10 && this.state.pre_contract<100){
      //  if(parseInt(this.refs.contract.innerHTML)<=3){
      //    this.refs.contract.innerHTML=3;
      //    return;
      //  }
      //}
      if (this.refs.contract.innerHTML === '1')
        return;
      this.refs.contract.innerHTML = parseInt(this.refs.contract.innerHTML) - 1;
    }
    else {
      //if(num==='10'){
      //  const aa=parseInt(this.refs.contract.innerHTML)<3 ? 3 : parseInt(this.refs.contract.innerHTML);
      //  this.refs.contract.innerHTML=3;
      //  this.setter.setState({
      //    pre_contract:aa*parseInt(num)
      //  });
      //}
      //else{
      this.setter.setState({
        pre_contract: parseInt(this.refs.contract.innerHTML) * parseInt(num)
      });
      //}

      return;
    }
    if (this.state.pre_contract >= 10000) {
      this.setter.setState({
        pre_contract: parseInt(this.refs.contract.innerHTML) * 10000
      });
    } else if (this.state.pre_contract >= 1000) {
      this.setter.setState({
        pre_contract: parseInt(this.refs.contract.innerHTML) * 1000
      });
    }
    else if (this.state.pre_contract >= 100) {
      this.setter.setState({
        pre_contract: parseInt(this.refs.contract.innerHTML) * 100
      });
    }
    else if (this.state.pre_contract >= 10) {
      //const aa=parseInt(this.refs.contract.innerHTML)<3 ? 3 : parseInt(this.refs.contract.innerHTML);
      this.setter.setState({
        pre_contract: parseInt(this.refs.contract.innerHTML) * 10
      });
    }

  };

  onPostState = () => {
    fetch("/api/enjoy", {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
        "Authorization": this.props.auth.userToken
      },
      body: JSON.stringify({
        guess: this.state.contract_no,
        contract_money: this.state.pre_contract,
        level: this.state.level
      })

    })
      .then(response => {
        if (response.status < 400) {
          response.json().then(res => {
            // console.log(res);
            if (res.error) {
              this.notificationSystem.addNotification({
                title: <MdWarning />,
                message: res.error,
                level: 'info',
              });
            } else {

              this.setter.setState({
                bet: res.bet
              });
              this.props.auth.user.budget = res.bet[0];
              localStorage.setItem('auth', JSON.stringify(this.props.auth));
            }
            this.setter.setState({
              modal: false
            });

          });

        } else {
          this.setter.setState({
            redirectToLogin: true
          })
        }

      });

  };


  onCategoryClick = num => () => {
    this.setter.setState({
      level: num
    });
    fetch("/api/enjoy/" + num, {
      "method": "GET",
      "headers": {
        "content-type": "application/json",
        "Authorization": this.props.auth.userToken
      }
    })
      .then(response => {
        if (response.status < 400) {
          response.json().then(res => {
            // console.log(res);
            if (res.time > 150000) {
              this.setter.setState({
                log_time: res.log_time,
                bet: res.bet,
                price: res.price ? res.price : this.state.price,
                records: res.records,
                my_records: res.my_records,
                number: res.number ? res.number : this.state.number,
                contract: res.contract ? res.contract : this.state.contract,
                time: 180000 - parseInt(res.time),
                modal: false,
                records_my_page: parseInt(res.records_my_page),
                last_records_my_page: parseInt(res.last_records_my_page),
                records_page: parseInt(res.records_page),
                last_records_page: parseInt(res.last_records_page)
              });
            } else {
              this.setter.setState({
                log_time: res.log_time,
                bet: res.bet,
                price: res.price ? res.price : this.state.price,
                records: res.records,
                my_records: res.my_records,
                number: res.number ? res.number : this.state.number,
                contract: res.contract ? res.contract : this.state.contract,
                time: 180000 - parseInt(res.time),
                modal: false,
                records_my_page: parseInt(res.records_my_page),
                last_records_my_page: parseInt(res.last_records_my_page),
                records_page: parseInt(res.records_page),
                last_records_page: parseInt(res.last_records_page)
              });

            }
            this.props.auth.user.budget = res.balance ? res.balance : this.props.auth.user.budget;
            localStorage.setItem('auth', JSON.stringify(this.props.auth));
            clearTimeout(timeOut);
            timeOut = setTimeout(this.onTimeDecrease, 1000);
          });

        } else {
          this.setter.setState({
            redirectToLogin: true
          })
        }

      });
  };
  gotoRecordsPage = num => () => {
    fetch("/api/enjoy-page/" + this.state.level + "/" + num, {
      "method": "GET",
      "headers": {
        "content-type": "application/json",
        "Authorization": this.props.auth.userToken
      }
    })
      .then(response => {
        if (response.status < 400) {
          response.json().then(res => {
            // console.log(res);
            this.setter.setState({
              records: res.records,
              modal: false,
              records_page: parseInt(res.records_page),
              last_records_page: parseInt(res.last_records_page)
            });



          });

        } else {
          this.setter.setState({
            redirectToLogin: true
          })
        }

      });
  }
  gotoMyRecordsPage = num => () => {
    fetch("/api/enjoy-my-page/" + this.state.level + "/" + num, {
      "method": "GET",
      "headers": {
        "content-type": "application/json",
        "Authorization": this.props.auth.userToken
      }
    })
      .then(response => {
        if (response.status < 400) {
          response.json().then(res => {
            // console.log(res);
            this.setter.setState({
              my_records: res.my_records,
              modal: false,
              records_my_page: parseInt(res.records_my_page),
              last_records_my_page: parseInt(res.last_records_my_page)
            });


          });

        } else {
          this.setter.setState({
            redirectToLogin: true
          })
        }

      });
  }
  onReload = () => {
    this.setter.setState({
      reload: true
    })
    fetch("/api/enjoy/" + this.state.level, {
      "method": "GET",
      "headers": {
        "content-type": "application/json",
        "Authorization": this.props.auth.userToken
      }
    })
      .then(response => {
        if (response.status < 400) {
          this.setter.setState({
            reload: false
          });
          response.json().then(res => {
            // console.log(res);
            clearTimeout(timeOut);
            timeOut = setTimeout(this.onTimeDecrease, 1000);
            this.props.auth.user.budget = res.balance ? res.balance : this.props.auth.user.budget;
            localStorage.setItem('auth', JSON.stringify(this.props.auth));
            if (res.time > 150000) {
              this.setter.setState({
                log_time: res.log_time,
                bet: res.bet,
                price: res.price ? res.price : this.state.price,
                records: res.records,
                my_records: res.my_records,
                number: res.number ? res.number : this.state.number,
                contract: res.contract ? res.contract : this.state.contract,
                time: 180000 - parseInt(res.time),
                records_my_page: parseInt(res.records_my_page),
                last_records_my_page: parseInt(res.last_records_my_page),
                records_page: parseInt(res.records_page),
                last_records_page: parseInt(res.last_records_page)
              });

            } else {
              this.setter.setState({
                log_time: res.log_time,
                bet: res.bet,
                price: res.price ? res.price : this.state.price,
                records: res.records,
                my_records: res.my_records,
                number: res.number ? res.number : this.state.number,
                contract: res.contract ? res.contract : this.state.contract,
                time: 180000 - parseInt(res.time),
                records_my_page: parseInt(res.records_my_page),
                last_records_my_page: parseInt(res.last_records_my_page),
                records_page: parseInt(res.records_page),
                last_records_page: parseInt(res.last_records_page)
              });
            }

          });

        } else {
          this.setter.setState({
            redirectToLogin: true
          })
        }

      });
  }

  onRecharge = () => {
    this.props.history.push('/my/recharge');
    // console.log('recharge');
  }
  render() {
    if (this.state.redirectToLogin)
      return (<Redirect to="/login" />);
    var count_down_color;
    if (this.state.time <= 30000)
      count_down_color = "red";
    else
      count_down_color = "black";
    if (this.state.reload === true) {
      return (
        <PageSpinner />
      );
    }
    else {
      return (
        <Page
          className="EnjoyPage"
          title={"Available Balance : ₹" + this.props.auth.user.budget}
          breadcrumbs={
            (this.props.auth.user.admin === true && this.props.auth.user.superAdmin === true) ? (
              <div style={{ 'width': '100%' }}>
                <Link color="danger" className="btn btn-danger" to="/enjoy-admin" >Admin</Link>
                <Link color="link" className="btn btn-warning" to="/my/recharge"  >Recharge</Link>

                <Button color="success" onClick={this.toggleRead()}>Read Rule</Button>
                <Button color="link" onClick={this.onReload} style={{ "float": "right" }}><FaSyncAlt /></Button>
              </div>

            ) : (
                <div style={{ 'width': '100%' }}>
                  <Link className="btn btn-warning" color="link" to="/my/recharge"  >Recharge</Link>
                  <Button color="success" onClick={this.toggleRead()}>Read Rule</Button>
                  <Button color="link" onClick={this.onReload} style={{ "float": "right" }}><FaSyncAlt /></Button>
                </div>
              )
          }
        >
          <Modal
            isOpen={this.state.readModal}
            toggle={this.toggleRead()}
            className={this.props.className}>
            <ModalHeader toggle={this.toggleRead()}>Rule</ModalHeader>
            <ModalBody>
              <Row className={'read-rule'} style={{ margin: "0 10px" }}>
                <p style={{ textAlign: 'center' }}><b><span
                  style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529' }}>ABOUT THE GAME:</span></b></p>

                <p style={{ textAlign: 'center' }}><b><span
                  style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529', background: 'white' }}>This Lottery</span></b><span
                    style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529', background: 'white' }}> is an
                    interesting game that comes up after every 3minutes, and from this
                    3minutes there is 2minutes 30seconds to place your bet on any of the available
                    “4“ Games that we have, and each Game closes after 2minutes 30seconds, then the
next 30seconds is to show the Bet result. </span><span style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529' }}><br />
                    <span style={{ background: 'white' }}>Please note that this <b>Lottery</b> operates a
24hours nonstop Game, meaning that every 3MINUTES new Game comes up which makes
it 20 betting opportunities in ONE HOUR, to a total of 480 Bets in 24HOURS.</span><br />
                  </span><span style={{ fontSize: '12.0pt', lineHeight: '115%' }}></span></p>

                <p style={{ textAlign: 'center' }}><b><span
                  style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529' }}>HOW TO BET:</span></b></p>

                <p style={{ textAlign: 'center' }}><span
                  style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529', background: 'white' }}>Example
                  if you spend ₹ 100 to bet, there is always a 2% deduction on every Bet
amount that goes to the referral, the 2% goes to whoever refers you to this <b>Lottery</b>,
so the more you refer people and they are placing bet on this <b>Lottery</b> the
more you making 2% on each bet that your referrals are placing on this <b>Lottery</b>.</span><span
                    style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529' }}><br />
                    <span style={{ background: 'white' }}>Now after deducting the 2% from your ₹ 100
                    , you will be having 98% left, so your bet is based on the 98% of the
                    ₹ 100 which will be ₹ 98. </span><br />
                    <span style={{ background: 'white' }}>Now to place bet you can choose from the 4 Games
that we have on our system. </span></span></p>

                <p style={{ textAlign: 'center' }}><span
                  style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529' }}><br />
                  <span style={{ background: 'white' }}>(1) <b>Bet on GREEN</b>: click on the Green tab
and a pop up will come up which gives you the opportunity to select your
betting amount of your choice and the number of betting that you feel
comfortable with, so if you decided to place the bet with the above ₹ 98 on a
Single bet number *1* then you only pay ₹ 98, if you increase your Bet number to
Double bet number *2* it means you placing bet with ₹ 196, and if you decided to
place your bet on triple bet number *3* it means you placing bet with ₹ 294. </span></span></p>

                <p style={{ textAlign: 'center' }}><span
                  style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529', background: 'white' }}>Please
                  note that you have only 2mins 30secs only to place your bet otherwise the bet
                  will close after 2mins 30secs and the result comes up within the next 30
                  seconds which makes it 3mins and another new game start again after every
3mins. </span><span style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529' }}><br />
                    <b><span style={{ background: 'white' }}>RESULT:</span></b><span style={{ background: 'white' }}> </span></span></p>

                <p style={{ textAlign: 'center' }}><span
                  style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529', background: 'white' }}>now
                  here comes the result, after that 2mins 30secs the system will process all bets
                  and display result after the 30 seconds which is displaying under GAME RECORDS,
                  please note that the result is only One Number which is applicable to all the
games on this <b>Lottery</b> system, so the result can be any of these number from <i>0
or 1 or 2 or 3 to 9</i>.</span><span style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529' }}><br />
                    <span style={{ background: 'white' }}>so if the result shows any of these FOUR numbers
<u><span style={{ background: 'yellow' }}>1 or 3 or 7 or 9</span></u>, then you have
won, if the results shows 1 you won, if result shows 3 you won, if the result
shows 7 you won, if the result shows 9 you won, if the result shows any number
that is different from these FOUR mentioned then you loosed the game.</span><br />
                    <b><span style={{ background: 'white' }}>YOUR PROFIT:</span></b><span
                      style={{ background: 'white' }}> </span></span></p>

                <p style={{ textAlign: 'center' }}><span
                  style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529', background: 'white' }}>now
                  let’s calculate your Profit on the Investment, based on your above ₹ 98
                  if you bet on single then you will get (₹ 98 × 2 = ₹ 196) if you bet on double
                  number which is a total bet of ₹ 296 then it means your profit on the investment
will be (₹ 296 × 2 = ₹ 592)</span><span style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529' }}><br />
                    <span style={{ background: 'white' }}>The Winning code number on <b>Bet on GREEN is 2</b>,
so it means you have to multiple your Bet amount by 2 to get your winning
amount, if you place bet with ₹ 500 it means you getting ₹ 1,000 winning.</span><br />
                    <span style={{ background: 'white' }}>And if the result shows 5, then your winning
                    code number is 1.5, you will have to calculate your betting amount by 1.5 to
give you your winning amount if the result shows 5. </span></span></p>

                <p style={{ textAlign: 'center' }}><span
                  style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529' }}><br />
                  <span style={{ background: 'white' }}>(2) <b>Bet on VIOLET</b>: click on the Violet
tab and a pop up will come up which gives you the opportunity to select your
betting amount of your choice and the number of betting that you feel
comfortable with, so if you decided to place the bet with the above ₹ 98 on a
Single bet number *1* then you only pay ₹ 98, if you increase your Bet number to
Double bet number *2* it means you placing bet with ₹ 196, and if you decided to
place your bet on triple bet number *3* it means you placing bet with ₹ 294.
Please note that you have only 2mins 30secs only to place your bet otherwise
the bet will close after 2mins 30secs and result comes up within the next 30
seconds which makes it 3mins and another new game start again after every
3mins.</span><br />
                  <b><span style={{ background: 'white' }}>RESULT:</span></b><span style={{ background: 'white' }}> </span></span></p>

                <p style={{ textAlign: 'center' }}><span
                  style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529', background: 'white' }}>now
                  here comes the result, after that 2mins 30 seconds the system will process all
                  bets and display result after the 30 seconds which is displaying under GAME
                  RECORDS, please note that the result is only One Number which is applicable to
                  all the games on this Lottery system, so the result can be any of these number from
<i>0 or 1 or 2 or 3 to 9</i>.</span><span style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529' }}><br />
                    <span style={{ background: 'white' }}>so if the result shows any of these TWO numbers <u><span
                      style={{ background: 'yellow' }}>0 or 5</span></u>, then you have won, if the results
shows 0 you won, if result shows 5 you won, if the result shows any number that
is different from these two mentioned then you loosed the game.</span><br />
                    <b><span style={{ background: 'white' }}>YOUR PROFIT:</span></b><span
                      style={{ background: 'white' }}> </span></span></p>

                <p style={{ textAlign: 'center' }}><span
                  style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529', background: 'white' }}>now
                  let’s calculate your Profit on the Investment, based on your above ₹ 98
                  if you bet on single then you will get (₹ 98 × 4.5 = ₹ 441) if you bet on double
                  number which is a total bet of ₹ 296 then it means your profit on the investment
will be (₹ 296 × 4.5 = ₹ 882)</span><span style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529' }}><br />
                    <span style={{ background: 'white' }}>The Winning code number on <b>Bet on VIOLET</b>
is 4.5, so it means you have to multiple your Bet amount by 4.5 to get your
winning amount, if you place bet with ₹ 500 it means you getting ₹ 2,250 winning.</span></span></p>

                <p style={{ textAlign: 'center' }}><span
                  style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529' }}><br />
                  <span style={{ background: 'white' }}>(3) <b>Bet on RED:</b> click on the Red tab and
a pop up will come up which gives you the opportunity to select your betting
amount of your choice and the number of betting that you feel comfortable with,
so if you decided to place the bet with the above ₹ 98 on a Single bet number
*1* then you only pay ₹ 98, if you increase your Bet number to Double bet number
*2* it means you placing bet with ₹ 196, and if you decided to place your bet on
triple bet number *3* it means you placing bet with ₹ 294. </span></span></p>

                <p style={{ textAlign: 'center' }}><span
                  style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529', background: 'white' }}>Please
                  note that you have only 2mins 30secs only to place your bet otherwise the bet
                  will close after 2mins 30secs and result comes up within the next 30 seconds which
makes it 3mins and another new game start again after every 3mins.</span><span
                    style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529' }}><br />
                    <b><span style={{ background: 'white' }}>RESULT:</span></b><span style={{ background: 'white' }}> </span></span></p>

                <p style={{ textAlign: 'center' }}><span
                  style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529', background: 'white' }}>now
                  here comes the result, after that 2mins 30 seconds the system will process all
                  bets and display result after the 30 seconds which is displaying under GAME
                  RECORDS, please note that the result is only One Number which is applicable to
                  all the games, so the result can be any of these number from 0 or 1 or 2 or 3
to 9.</span><span style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529' }}><br />
                    <span style={{ background: 'white' }}>so if the result shows any of these FOUR numbers
<i><u><span style={{ background: 'yellow' }}>2 or 4 or 6 or 8</span></u></i>, then you
have won, if the results shows 2 you won, if result shows 4 you won, if the
result shows 6 you won, if the result shows 8 you won, if the result shows any
number that is different from these FOUR mentioned then you loosed the game.</span><br />
                    <b><span style={{ background: 'white' }}>YOUR PROFIT</span></b><span style={{ background: 'white' }}>: </span></span></p>

                <p style={{ textAlign: 'center' }}><span
                  style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529', background: 'white' }}>now
                  let’s calculate your Profit on the Investment, based on your above ₹ 98
                  if you bet on single then you will get (₹ 98 × 2 = ₹ 196) if you bet on double
                  number which is a total bet of ₹ 296 then it means your profit on the investment
will be (₹ 296 × 2 = ₹ 592)</span><span style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529' }}><br />
                    <span style={{ background: 'white' }}>The Winning code number on <b>Bet on RED</b> is
2, so it means you have to multiple your Bet amount by 2 to get your winning
amount, if you place bet with ₹ 500 it means you getting ₹ 1,000 winning.</span><br />
                    <span style={{ background: 'white' }}>And if the result shows 0, then your winning
                    code number is 1.5, you will have to calculate your betting amount by 1.5 to
give you your winning amount. </span></span></p>

                <p style={{ textAlign: 'center' }}><span
                  style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529' }}><br />
                  <span style={{ background: 'white' }}>(4) <b>Bet on NUMBER</b>: on the dash board you
will see there are number from <i>0 to 9</i>, click on any of the number that
you wish to place bet on, it can be <i>0 or 1 or 2 or 3 or 4 or 5 or 6 or 7 or
8 or 9</i> and a pop up will come up which gives you the opportunity to select
your betting amount of your choice and the number of betting that you feel
comfortable with, so if you decided to place the bet with the above ₹ 98 on a
Single bet number *1* it means you placing bet with ₹ 98, if you increase your
Bet number to Double bet number *2* it means you placing bet with ₹ 196, and if
you decided to place your bet on triple bet number *3* it means you placing bet
with ₹ 294. </span></span></p>

                <p style={{ textAlign: 'center' }}><span
                  style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529', background: 'white' }}>Please
                  note that you have only 2mins 30secs only to place your bet otherwise the bet
                  will close after 2mins 30secs and result comes up within the next 30 seconds
which makes it 3mins and another new game start again after every 3mins.</span><span
                    style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529' }}><br />
                    <b><span style={{ background: 'white' }}>RESULT:</span></b></span></p>

                <p style={{ textAlign: 'center' }}><span
                  style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529', background: 'white' }}>now
                  here comes the result, after that 2mins 30 seconds the system will process all
                  bets and display result after the 30 seconds which is displaying under GAME
                  RECORDS, please note that the result is only One Number which is applicable to
all the games, so the result can be any of these number from <i><u>1 or 2 or 3 or
4 or 5 or 6 or 7 or 8 or 9</u></i>.</span><span style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529' }}><br />
                    <span style={{ background: 'white' }}>so if the result shows any of those TEN numbers
from <u><span style={{ background: 'yellow' }}>0 to 9</span></u> and it is same number
you place bet on, then you have won, if the result shows any number that is
different from number you place bet on then you loosed the game.</span><br />
                    <b><span style={{ background: 'white' }}>YOUR PROFIT</span></b><span style={{ background: 'white' }}>:</span></span></p>

                <p style={{ textAlign: 'center' }}><span
                  style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529', background: 'white' }}>now
                  let’s calculate your Profit on the Investment, based on your above ₹ 98
                  if you bet on single then you will get (₹ 98 × 9 = ₹ 882) if you bet on double
                  number which is a total bet of ₹ 296 then it means your profit on the investment
will be (₹ 296 × 9 = ₹ 1,764)</span><span style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529' }}><br />
                    <span style={{ background: 'white' }}>The Winning code number on <b>Bet on NUMBER is 9</b>,
so it means you have to multiple your Bet amount by 9 to get your winning
amount, if you place bet with ₹ 500 it means you getting ₹ 4,500 winning.</span><br />
                    <br />
                    <b><span style={{ background: 'white' }}>HOW TO WITHDRAW YOUR MONEY:</span><br />
                    </b><span style={{ background: 'white' }}>In order for you to withdraw your money, you
                    need click on My Profile and Click on Wallet then finally click on Withdrawal.
Please note <b>This Lottery</b> currently support only two withdrawal methods:</span></span></p>

                <p style={{ marginLeft: '.75in', textAlign: 'center', textIndent: '-.5in' }}><span style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529' }}>(1.)<span style={{ font: '7.0pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span><span style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529', background: 'white' }}>You can withdraw into your <b>ACCOUNT</b></span></p>

                <p style={{ marginLeft: '.75in', textAlign: 'center', textIndent: '-.5in' }}><span style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529' }}>(2.)<span style={{ font: '7.0pt "Times New Roman"' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span><span style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529', background: 'white' }}>You can withdraw into your <b> UPI ACCOUNT </b>from there
you can move the fund into your bank account directly or into your bank cards.</span></p>

                <p ><span style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529', background: 'white' }}>&nbsp;</span></p>

                <p style={{ marginLeft: '.25in', textAlign: 'center' }}><span
                  style={{ fontSize: '12.0pt', lineHeight: '115%', color: '#212529', background: 'white' }}>Those
                  are the both withdrawal methods that our system currently support, more
withdrawal options coming soon.</span></p>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggleRead()}>
                Ok
              </Button>
            </ModalFooter>
          </Modal>


          <Row style={{ flexFlow: "row wrap", "justifyContent": "space-between" }} className="category-bar">

            <Button className={this.state.level === 0 ? "btn-active" : ''} color="link" onClick={this.onCategoryClick(0)}>parity</Button>
            <Button className={this.state.level === 1 ? "btn-active" : ''} color="link" onClick={this.onCategoryClick(1)}>Sapre</Button>
            <Button className={this.state.level === 2 ? "btn-active" : ''} color="link" onClick={this.onCategoryClick(2)}>Bcone</Button>
            <Button className={this.state.level === 3 ? "btn-active" : ''} color="link" onClick={this.onCategoryClick(3)}>Emerd</Button>

          </Row>
          <Row>
            <Col md="12" sm="12" xs="12">
              <Card className="mb-3">
                <CardHeader>
                  <div className="card-period">
                    <span>Period</span>
                    <span style={{ fontWeight: "bolder" }}>
                      {this.state.log_time}
                    </span>
                  </div>
                  <div className="card-count">
                    <span>Count Down</span>
                    <span style={{ fontWeight: "bolder", 'color': count_down_color }}>{parseInt(this.state.time / 1000 / 60) + " : " + parseInt((this.state.time / 1000) % 60)}
                    </span>
                  </div>
                </CardHeader>

                {
                  (this.state.time >= 30000) ? (
                    <CardBody>
                      {/* <Row style={{flexFlow: "row wrap","justifyContent": "space-between"}}>
                          {
                            this.state.bet[1][10]==0 ? (
                              <Button color="success" onClick={this.onButtonClick(10)}>Join Green</Button>
                            ) : (
                              <Button color="error" >Join Green</Button>
                            )
                          }
                          {
                            this.state.bet[1][12]==0 ? (
                              <Button color="primary" onClick={this.onButtonClick(12)}>Join Violet</Button>
                            ) : (
                              <Button color="error" >Join Violet</Button>
                            )
                          }
                          {
                            this.state.bet[1][11]==0 ? (
                              <Button color="secondary" onClick={this.onButtonClick(11)}>Join Red</Button>
                            ) : (
                              <Button color="error" >Join Red</Button>
                            )
                          }                          
                            
                        </Row>
                        <Row style={{flexFlow: "row wrap","justifyContent": "space-between"}}>
                            {
                              this.state.bet[1][0]==0 ? (
                                <Button onClick={this.onButtonClick(0)} color="success" style={{"border":"0px","background": "-webkit-gradient(linear,left top,right bottom,from(#fc5c7d),color-stop(50%,#fc5c7d),color-stop(51%,#6a82fb),to(#6a82fb))","background": "linear-gradient(to bottom right,#fc5c7d 0,#fc5c7d 50%,#6a82fb 51%,#6a82fb)"}}> 0 </Button>
                              ) : (
                                <Button color="error" > 0 </Button>
                              )
                            }     
                            {
                              this.state.bet[1][1]==0 ? (
                                <Button onClick={this.onButtonClick(1)} color="success" style={{"border":"0px"}}> 1 </Button>
                              ) : (
                                <Button color="error" > 1 </Button>
                              )
                            }     
                            {
                              this.state.bet[1][2]==0 ? (
                                <Button onClick={this.onButtonClick(2)} color="secondary" style={{"border":"0px"}}> 2 </Button>
                              ) : (
                                <Button color="error" > 2 </Button>
                              )
                            }     
                            {
                              this.state.bet[1][3]==0 ? (
                                <Button onClick={this.onButtonClick(3)} color="success" style={{"border":"0px"}}> 3 </Button>
                                ) : (
                                <Button color="error" > 3 </Button>
                              )
                            }     
                            {
                              this.state.bet[1][4]==0 ? (
                                <Button onClick={this.onButtonClick(4)} color="secondary" style={{"border":"0px"}}> 4 </Button>
                              ) : (
                                <Button color="error" > 4 </Button>
                              )
                            }       
                        </Row>
                        <Row style={{flexFlow: "row wrap","justifyContent": "space-between"}}>
                            {
                              this.state.bet[1][5]==0 ? (
                                <Button onClick={this.onButtonClick(5)} color="success" style={{"border":"0px","background": "-webkit-gradient(linear,left top,right bottom,from(#45b649),color-stop(50%,#45b649),color-stop(51%,#6a82fb),to(#6a82fb))","background": "linear-gradient(to bottom right,#45b649 0,#45b649 50%,#6a82fb 51%,#6a82fb)"}}> 5 </Button>
                                ) : (
                                <Button color="error" > 5 </Button>
                              )
                            }     
                            {
                              this.state.bet[1][6]==0 ? (
                                <Button onClick={this.onButtonClick(6)} color="secondary" style={{"border":"0px"}}> 6 </Button>
                                ) : (
                                <Button color="error" > 6 </Button>
                              )
                            }     
                            {
                              this.state.bet[1][7]==0 ? (
                                <Button onClick={this.onButtonClick(7)} color="success" style={{"border":"0px"}}> 7 </Button>
                                ) : (
                                <Button color="error" > 7 </Button>
                              )
                            }     
                            {
                              this.state.bet[1][8]==0 ? (
                                <Button onClick={this.onButtonClick(8)} color="secondary" style={{"border":"0px"}}> 8 </Button>
                                ) : (
                                <Button color="error" > 8 </Button>
                              )
                            }     
                            {
                              this.state.bet[1][9]==0 ? (
                                <Button onClick={this.onButtonClick(9)} color="success" style={{"border":"0px"}}> 9 </Button>
                                ) : (
                                <Button color="error" > 9 </Button>
                              )
                            }     
                        </Row> */}
                      <Row style={{ flexFlow: "row wrap", "justifyContent": "space-between" }}>

                        <Button color="success" style={{ background: "#2E7D32" }} onClick={this.onButtonClick(10)}>
                          <span>Join Green</span><br /><span style={{ color: "gold" }}>{this.state.bet[1][10]}₹</span></Button>

                        <Button color="primary" className="btn-violet" onClick={this.onButtonClick(12)}>
                          <span>Join Violet</span><br /><span style={{ color: "gold" }}>{this.state.bet[1][12]}₹</span></Button>

                        <Button color="secondary" style={{ background: "#D50000" }} onClick={this.onButtonClick(11)}>
                          <span>Join Red</span><br /><span style={{ color: "gold" }}>{this.state.bet[1][11]}₹</span></Button>


                      </Row>
                      <Row style={{ flexFlow: "row wrap", "justifyContent": "space-between" }}>

                        <Button onClick={this.onButtonClick(0)} color="success" style={{ "border": "0px", "background": "-webkit-gradient(linear,left top,right bottom,from(#D50000),color-stop(50%,#D50000),color-stop(51%,#9c27b0),to(#9c27b0))", "background": "linear-gradient(to bottom right,#D50000 0,#D50000 50%,#9c27b0 51%,#9c27b0)" }}> 0 : <span style={{ color: "gold" }}>{this.state.bet[1][0]}₹ </span></Button>

                        <Button onClick={this.onButtonClick(1)} color="success" style={{ "border": "0px", background: "#2E7D32" }}> 1 : <span style={{ color: "gold" }}>{this.state.bet[1][1]}₹ </span></Button>

                        <Button onClick={this.onButtonClick(2)} color="secondary" style={{ "border": "0px", background: "#D50000" }}> 2 : <span style={{ color: "gold" }}>{this.state.bet[1][2]}₹ </span></Button>

                        <Button onClick={this.onButtonClick(3)} color="success" style={{ "border": "0px", background: "#2E7D32" }}> 3 : <span style={{ color: "gold" }}>{this.state.bet[1][3]}₹ </span></Button>

                        <Button onClick={this.onButtonClick(4)} color="secondary" style={{ "border": "0px", background: "#D50000" }}> 4 : <span style={{ color: "gold" }}>{this.state.bet[1][4]}₹ </span></Button>

                      </Row>
                      <Row style={{ flexFlow: "row wrap", "justifyContent": "space-between" }}>

                        <Button onClick={this.onButtonClick(5)} color="success" style={{ "border": "0px", "background": "-webkit-gradient(linear,left top,right bottom,from(#2E7D32),color-stop(50%,#2E7D32),color-stop(51%,#9c27b0),to(#9c27b0))", "background": "linear-gradient(to bottom right,#2E7D32 0,#2E7D32 50%,#9c27b0 51%,#9c27b0)" }}> 5 : <span style={{ color: "gold" }}>{this.state.bet[1][5]}₹ </span></Button>

                        <Button onClick={this.onButtonClick(6)} color="secondary" style={{ "border": "0px", background: "#D50000" }}> 6 : <span style={{ color: "gold" }}>{this.state.bet[1][6]}₹ </span></Button>

                        <Button onClick={this.onButtonClick(7)} color="success" style={{ "border": "0px", background: "#2E7D32" }}> 7 : <span style={{ color: "gold" }}>{this.state.bet[1][7]}₹ </span></Button>

                        <Button onClick={this.onButtonClick(8)} color="secondary" style={{ "border": "0px", background: "#D50000" }}> 8 : <span style={{ color: "gold" }}>{this.state.bet[1][8]}₹ </span></Button>

                        <Button onClick={this.onButtonClick(9)} color="success" style={{ "border": "0px", background: "#2E7D32" }}> 9 : <span style={{ color: "gold" }}>{this.state.bet[1][9]}₹ </span></Button>

                      </Row>
                      {/* <Row>
                          {
                            this.state.bet[1].map((ele,key)=>(
                              (key===10) ? (
                                <div className='contract-line'>
                                <span className="green-circle"></span>&nbsp; :&nbsp;&nbsp;
                                {this.state.bet[1][10]}
                                </div>
                              ) : (
                                (key===12) ? (
                                  <div className='contract-line'>
                                  <span className="violet-circle"></span>&nbsp;:&nbsp;&nbsp;
                                  {this.state.bet[1][12]}
                                  </div>
                                ) : (
                                  (key===11) ? (
                                    <div className='contract-line'>
                                    <span className="red-circle"></span>&nbsp;:&nbsp;&nbsp;
                                    {this.state.bet[1][11]}
                                    </div>
                                  ) : (
                                    <div className='contract-line'>
                                    <span>{key}</span>&nbsp;:&nbsp;&nbsp;
                                    {this.state.bet[1][key]}
                                    </div>
                                  )
                                )
                              )
                              
                            ))
                          }
                        </Row> */}
                      <Modal
                        isOpen={this.state.modal}
                        toggle={this.toggle()}
                        className={this.props.className}>
                        <ModalHeader toggle={this.toggle()}>Contract Money on "{this.state.contract_no < 10 ? this.state.contract_no : (
                          this.state.contract_no === 10 ? (<span>green{' '}<span className='green-circle'></span></span>) : (
                            this.state.contract_no === 11 ? (<span>red{' '}<span className="red-circle"></span></span>) : (<span>violet{' '}<span className="violet-circle"></span></span>)
                          )
                        )}"</ModalHeader>
                        <ModalBody>
                          <Row>
                            <span style={{ 'padding': '6px 12px' }}>
                              Contract Money :
                              </span>
                            <br />
                            <ButtonGroup className=" mb-3 ml-auto mr-auto">
                              <Button style={{ fontWeight: '600' }} color='link' onClick={this.onContractChange('10')} className={(this.state.pre_contract > 9 && this.state.pre_contract < 100) ? "btn-active" : ''}>10</Button>
                              <Button style={{ fontWeight: '600' }} color='link' onClick={this.onContractChange('100')} className={(this.state.pre_contract > 99 && this.state.pre_contract < 1000) ? "btn-active" : ''}>100</Button>
                              <Button style={{ fontWeight: '600' }} color='link' onClick={this.onContractChange('1000')} className={(this.state.pre_contract > 999 && this.state.pre_contract < 10000) ? "btn-active" : ''}>1000</Button>
                              <Button style={{ fontWeight: '600' }} color='link' onClick={this.onContractChange('10000')} className={(this.state.pre_contract > 9999 && this.state.pre_contract < 100000) ? "btn-active" : ''}>10000</Button>
                            </ButtonGroup>
                          </Row>
                          <Row>
                            <span style={{ 'padding': '10px 12px' }}>
                              Number :
                              </span>
                            <br />
                            <div>
                              <Button color='link' style={{ fontSize: '1.5rem' }} onClick={this.onContractChange('-')}> - </Button>
                              <span style={{ 'padding': '6px 12px' }} ref='contract'>1</span>

                              <Button color='link' style={{ fontSize: '1.5rem' }} onClick={this.onContractChange('+')}> + </Button>
                            </div>

                          </Row>
                          <Row>
                            <span style={{ 'padding': '0 12px' }}>
                              Total contract money is &nbsp;
                              </span>
                            <span style={{ fontWeight: '600' }} className="text-success">{' '}{this.state.pre_contract}</span>
                          </Row>
                          <Row>

                          </Row>

                        </ModalBody>
                        <ModalFooter>
                          <Button color="primary" onClick={this.onPostState}>
                            OK
                            </Button>{' '}
                          <Button color="secondary" onClick={this.toggle()}>
                            Cancel
                            </Button>
                        </ModalFooter>
                      </Modal>

                    </CardBody>
                  ) : (
                      <CardBody>
                        <Row style={{ flexFlow: "row wrap", "justifyContent": "space-between" }}>
                          <Button color="error" >Join Green</Button>
                          <Button color="error" >Join Violet</Button>
                          <Button color="error">Join Red</Button>

                        </Row>
                        <Row style={{ flexFlow: "row wrap", "justifyContent": "space-between" }}>
                          <Button color="error" style={{ "border": "0px" }}> 0 </Button>
                          <Button color="error" style={{ "border": "0px" }}> 1 </Button>
                          <Button color="error" style={{ "border": "0px" }}> 2 </Button>
                          <Button color="error" style={{ "border": "0px" }}> 3 </Button>
                          <Button color="error" style={{ "border": "0px" }}> 4 </Button>
                        </Row>
                        <Row style={{ flexFlow: "row wrap", "justifyContent": "space-between" }}>
                          <Button color="error" style={{ "border": "0px" }}> 5 </Button>
                          <Button color="error" style={{ "border": "0px" }}> 6 </Button>
                          <Button color="error" style={{ "border": "0px" }}> 7 </Button>
                          <Button color="error" style={{ "border": "0px" }}> 8 </Button>
                          <Button color="error" style={{ "border": "0px" }}> 9 </Button>
                        </Row>
                        <Row>
                          {
                            this.state.bet[1].map((ele, key) => (
                              (key === 10) ? (
                                <div className='contract-line' key={key}>
                                  <span className="green-circle"></span>&nbsp; :&nbsp;&nbsp;
                                  {this.state.bet[1][10]}
                                </div>
                              ) : (
                                  (key === 12) ? (
                                    <div className='contract-line' key={key}>
                                      <span className="violet-circle"></span>&nbsp;:&nbsp;&nbsp;
                                      {this.state.bet[1][12]}
                                    </div>
                                  ) : (
                                      (key === 11) ? (
                                        <div className='contract-line' key={key}>
                                          <span className="red-circle"></span>&nbsp;:&nbsp;&nbsp;
                                          {this.state.bet[1][11]}
                                        </div>
                                      ) : (
                                          <div className='contract-line' key={key}>
                                            <span>{key}</span>&nbsp;:&nbsp;&nbsp;
                                            {this.state.bet[1][key]}
                                          </div>
                                        )
                                    )
                                )

                            ))
                          }
                        </Row>
                      </CardBody>
                    )

                }

              </Card>
            </Col>
            <Col md="6" sm="12" xs="12">
              <Card className="mb-3">
                <CardHeader>Game Record</CardHeader>
                <CardBody style={{ 'padding': '0 15px' }}>
                  <Row style={{ flexFlow: "row wrap", "justifyContent": "space-between", "overflow": "scroll" }}>
                    <Table {...{ 'default': true }} style={{ 'width': '100%' }}>
                      <thead>
                        <tr>
                          <th>Period</th>
                          <th>Price</th>
                          <th>Number</th>
                          <th>Result</th>
                        </tr>
                      </thead>
                      <tbody>{
                        this.state.records ? this.state.records.map((ele, key) => (
                          <tr key={key}>
                            <td>{ele.createdAt}</td>
                            <td>{ele.price ? ele.price.toFixed(0) : ''}</td>
                            <td>{ele.recommend}</td>
                            <td> {parseInt(ele.recommend) % 2 === 1 ? (<span className="green-circle"></span>) : (<span className="red-circle"></span>)} {parseInt(ele.recommend) % 5 === 0 ? (<span className="violet-circle"></span>) : ""}</td>
                          </tr>
                        )) : ''
                      }</tbody>
                    </Table>
                  </Row>
                  <Row>
                    <Pagination size="md" aria-label="Page navigation example">
                      {
                        this.state.records_page > 1 ? (
                          <PaginationItem>
                            <PaginationLink previous onClick={this.gotoRecordsPage(1)} />
                          </PaginationItem>
                        ) : ''
                      }
                      {
                        this.state.records_page > 1 ? (
                          <PaginationItem>
                            <PaginationLink onClick={this.gotoRecordsPage(this.state.records_page - 1)}>
                              {parseInt(this.state.records_page) - 1}
                            </PaginationLink>
                          </PaginationItem>
                        ) : ''
                      }

                      <PaginationItem active>
                        <PaginationLink>
                          {this.state.records_page}
                        </PaginationLink>
                      </PaginationItem>
                      {
                        this.state.records_page < this.state.last_records_page ? (
                          <PaginationItem>
                            <PaginationLink onClick={this.gotoRecordsPage(this.state.records_page + 1)}>
                              {this.state.records_page + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ) : ''
                      }
                      {
                        this.state.records_page < this.state.last_records_page ? (
                          <PaginationItem>
                            <PaginationLink next onClick={this.gotoRecordsPage(this.state.last_records_page)} />
                          </PaginationItem>
                        ) : ''
                      }


                    </Pagination>
                  </Row>


                </CardBody>
              </Card>
            </Col>
            {/* <Col md="6" sm="12" xs="12">
              <Card className="mb-3">
                <CardHeader>Best & Worst Players</CardHeader>
                <CardBody style={{ 'padding': '0 15px' }}>
                  <Row style={{ flexFlow: "row wrap", "justifyContent": "space-between", "overflow": "scroll" }}>
                    <Table {...{ 'default': true }} style={{ 'width': '100%' }}>
                      <thead>
                        <tr>
                          <th>Period</th>
                          <th>Best winner</th>
                          <th>Amount</th>
                          <th>Worst loser</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>{
                        this.state.records ? this.state.records.map((ele, key) => (
                          <tr key={key}>
                            <td>{ele.createdAt}</td>
                            <td>{ele.winner}</td>
                            <td>{ele.winner_amount? ele.winner_amount.toFixed(0) : ""}</td>
                            <td>{ele.loser}</td>
                            <td>{ele.loser_amount ? ele.loser_amount.toFixed(0) : ""}</td>
                          </tr>
                        )) : ''
                      }</tbody>
                    </Table>
                  </Row>
                  <Row>
                    <Pagination size="md" aria-label="Page navigation example">
                      {
                        this.state.records_page > 1 ? (
                          <PaginationItem>
                            <PaginationLink previous onClick={this.gotoRecordsPage(1)} />
                          </PaginationItem>
                        ) : ''
                      }
                      {
                        this.state.records_page > 1 ? (
                          <PaginationItem>
                            <PaginationLink onClick={this.gotoRecordsPage(this.state.records_page - 1)}>
                              {parseInt(this.state.records_page) - 1}
                            </PaginationLink>
                          </PaginationItem>
                        ) : ''
                      }

                      <PaginationItem active>
                        <PaginationLink>
                          {this.state.records_page}
                        </PaginationLink>
                      </PaginationItem>
                      {
                        this.state.records_page < this.state.last_records_page ? (
                          <PaginationItem>
                            <PaginationLink onClick={this.gotoRecordsPage(this.state.records_page + 1)}>
                              {this.state.records_page + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ) : ''
                      }
                      {
                        this.state.records_page < this.state.last_records_page ? (
                          <PaginationItem>
                            <PaginationLink next onClick={this.gotoRecordsPage(this.state.last_records_page)} />
                          </PaginationItem>
                        ) : ''
                      }


                    </Pagination>
                  </Row>


                </CardBody>
              </Card>
            </Col> */}
            <Col md="6" sm="12" xs="12">
              <Card className="mb-3">
                <CardHeader>My Record</CardHeader>
                <CardBody style={{ 'padding': '0 15px' }}>
                  <Row style={{ flexFlow: "row wrap", "justifyContent": "space-between", "overflow": "scroll" }}>
                    <Table {...{ 'default': true }}>
                      <thead>
                        <tr>
                          <th>Period</th>
                          <th>Contract money</th>
                          <th>Select</th>
                          <th>Result</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          this.state.my_records ? this.state.my_records.map((ele, key) => (
                            <tr key={key}>
                              <td>{ele.period}</td>
                              <td>{ele.contract}</td>
                              <td>{ele.select === 10 ? (<span className="green-circle"></span>) : (
                                ele.select === 11 ? (<span className="red-circle"></span>) : (
                                  ele.select === 12 ? (<span className="violet-circle"></span>) : ele.select
                                )
                              )

                              }</td>
                              <td>{ele.result}{' '} {parseInt(ele.result) % 2 === 1 ? (<span className="green-circle"></span>) : (<span className="red-circle"></span>)} {parseInt(ele.result) % 5 === 0 ? (<span className="violet-circle"></span>) : ""}</td>
                              <td>{ele.amount}</td>
                            </tr>
                          )) : ''
                        }

                      </tbody>
                    </Table>
                  </Row>
                  <Row>
                    <Pagination size="md" aria-label="Page navigation example">
                      {
                        this.state.records_my_page > 1 ? (
                          <PaginationItem>
                            <PaginationLink previous onClick={this.gotoMyRecordsPage(1)} />
                          </PaginationItem>
                        ) : ''
                      }
                      {
                        this.state.records_my_page > 1 ? (
                          <PaginationItem>
                            <PaginationLink onClick={this.gotoMyRecordsPage(this.state.records_my_page - 1)}>
                              {this.state.records_my_page - 1}
                            </PaginationLink>
                          </PaginationItem>
                        ) : ''
                      }

                      <PaginationItem active>
                        <PaginationLink >
                          {this.state.records_my_page}
                        </PaginationLink>
                      </PaginationItem>
                      {
                        this.state.records_my_page < this.state.last_records_my_page ? (
                          <PaginationItem>
                            <PaginationLink onClick={this.gotoMyRecordsPage(this.state.records_my_page + 1)}>
                              {this.state.records_my_page + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ) : ''
                      }
                      {
                        this.state.records_my_page < this.state.last_records_my_page ? (
                          <PaginationItem>
                            <PaginationLink next onClick={this.gotoMyRecordsPage(this.state.last_records_my_page)} />
                          </PaginationItem>
                        ) : ''
                      }


                    </Pagination>
                  </Row>




                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <div style={{ "height": '60px' }}></div>
          </Row>
          <NotificationSystem
            dismissible={false}
            ref={notificationSystem =>
              (this.notificationSystem = notificationSystem)
            }
            style={NOTIFICATION_SYSTEM_STYLE}
          />
        </Page>
      );
    }

  }
}

export default EnjoyPage;
