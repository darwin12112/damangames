import logo200Image from 'assets/img/logo/logo_200.png';
import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import NotificationSystem from 'react-notification-system';
import {
  MdWarning,
} from 'react-icons/md';
import PageSpinner from './PageSpinner';
import {stateSetter} from './Service';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.setter = stateSetter(this);
  
    }

    state={
      phone:'',
      password:'',
      confirmPassword:'',
      recommendationCode:this.props.params,
      confirmPWDErr:false,
      inProgress:false,
      agree:false,
      verify:'',
      otpProgress:false
    }
  componentWillUnmount() {
    this.setter.cancel();
    
    }
 
  get isLogin() {
    return this.props.authState === STATE_LOGIN;
  }

  get isSignup() {
    return this.props.authState === STATE_SIGNUP;
  }
  get isPhone() {
    return this.props.authState === STATE_PHONE;
  }
  get isVerify() {
    return this.props.authState === STATE_VERIFY;
  }
  changeAuthState = authState => event => {
    event.preventDefault();
// console.log(authState);
      this.props.onChangeAuthState(authState);
   
    
  };
sendOTP=()=>{
    // console.log(this.state);
    this.setter.setState({
      otpProgress:true
    });
    fetch("/api/phone", {
      "method": "POST",
      "headers": {
        "content-type": "application/json",
      },
      "body": JSON.stringify({
        phone: localStorage.getItem('phone'),
      })
    })
    .then(response =>{ 
      this.setter.setState({
        otpProgress:false
      });
      if(response.status<400){
        response.json().then(res=>{
         
        }).catch(()=>{});

      }else{
        response.json().then(res=>{       
          this.notificationSystem.addNotification({
            title: <MdWarning />,
            message:res.error,
            level: 'info',
          });
          
        }).catch(()=>{});
        
      }

    })
    .catch(()=>{});
  }
  handleSubmit = event => {


    event.preventDefault();
    if(this.props.authState === STATE_LOGIN){
      this.setter.setState({
        inProgress:true
      })
      fetch("/api/login", {
        "method": "POST",
        "headers": {
          "content-type": "application/json",
        },
        "body": JSON.stringify({
          phone: this.state.phone,
          password: this.state.password
        })
      })
      .then(response =>{ 
        if(response.status<400){
          response.json().then(res=>{
            localStorage.setItem("auth",JSON.stringify(res));
            this.setter.setState({
              inProgress:false
            });
            this.props.onSubmit();
          });
  
        }else{
          response.json().then(res=>{
            if(res.error=='1'){
              localStorage.setItem("phone",res.phone);
              this.props.onChangeAuthState(STATE_VERIFY);
            }else{
              this.setter.setState({
                inProgress:false
              });
              this.notificationSystem.addNotification({
                title: <MdWarning />,
                message:res.error,
                level: 'info'});
            }
            

          });
          
        }
  
      });
      
    }else if(this.props.authState === STATE_SIGNUP){
      // console.log(this.state);
      if(!this.state.confirmPWDErr && this.state.phone!=='' && this.state.recommendationCode!=='' && this.state.agree){
        // console.log(this.state);
        this.setter.setState({
          inProgress:true
        })
        fetch("/api/signup", {
          "method": "POST",
          "headers": {
            "content-type": "application/json",
          },
          "body": JSON.stringify({
            phone: this.state.phone,
            password: this.state.password,
            recommendationCode:this.state.recommendationCode
          })
        })
        .then(response =>{ 
          if(response.status<400){
            this.setter.setState({
              inProgress:false
            });
            response.json().then(res=>{
              // console.log(res);
              localStorage.setItem("phone",this.state.phone);
              this.props.onChangeAuthState(STATE_VERIFY);
            });
    
          }else{
            if(response.status==422){
              response.json().then(res=>{
                this.setter.setState({
                  inProgress:false
                });
                // console.log(this.state.agree);
                this.notificationSystem.addNotification({
                      title: <MdWarning />,
                      message:res.errors[0].msg,
                      level: 'info',
                    });
              });
            }else{
              response.json().then(res=>{
                this.setter.setState({
                  inProgress:false
                });
                // console.log(this.state.agree);
                this.notificationSystem.addNotification({
                      title: <MdWarning />,
                      message:res.error,
                      level: 'info',
                    });
              });
            }
          }
    
        });
      }
      
    }else if(this.props.authState === STATE_PHONE){
      this.setter.setState({
        inProgress:true
      });

      fetch("/api/phone", {
        "method": "POST",
        "headers": {
          "content-type": "application/json",
        },
        "body": JSON.stringify({
          phone:this.state.phone
        })
      })
      .then(response =>{ 
        if(response.status<400){
          response.json().then(res=>{
            localStorage.setItem("phone",this.state.phone);
            // console.log(this.props);
            this.props.onChangeAuthState(STATE_VERIFY);
          }).catch(()=>{});
  
        }else{
          response.json().then(res=>{
            this.setter.setState({
              inProgress:false
            });
            this.notificationSystem.addNotification({
              title: <MdWarning />,
              message:res.error,
              level: 'info',
            });
            
          }).catch(()=>{});
          
        }
  
      })
      .catch(()=>{});
    }else{
      this.setter.setState({
        inProgress:true
      });
        fetch("/api/verify", {
          "method": "POST",
          "headers": {
            "content-type": "application/json",
          },
          "body": JSON.stringify({
            phone: localStorage.getItem('phone'),
            otp: this.state.verify
          })
        })
        .then(response =>{ 
          if(response.status<400){
            response.json().then(res=>{
              localStorage.clear();
              localStorage.setItem("auth",JSON.stringify(res));
              this.setter.setState({
                inProgress:false
              });
              this.props.onSubmit();
            });
    
          }else{
            response.json().then(res=>{
              this.setter.setState({
                inProgress:false
              });
              this.notificationSystem.addNotification({
                title: <MdWarning />,
                message:res.error,
                level: 'info',
              });
            });
          }
    
        });
      
      
    }
    
  };
  changePhone= event =>{
    this.setter.setState({
      phone: event.target.value
    })
  }
  changeVerify= event =>{
    this.setter.setState({
      verify: event.target.value
    })
  }
  changePassword= event =>{
    if(event.target.value!==this.state.confirmPassword){
      this.setter.setState({
        confirmPWDErr:true,
        password:event.target.value
      })
    }else{
      this.setter.setState({
        confirmPWDErr:false,
        password:event.target.value
      })
    }
  }
  changeConfirmPassword= event =>{
    if(event.target.value!==this.state.password){
      this.setter.setState({
        confirmPWDErr:true,
        confirmPassword:event.target.value
      })
    }else{
      this.setter.setState({
        confirmPWDErr:false,
        confirmPassword:event.target.value
      })
    }
    

  }
  changeRecommendationCdoe= event =>{
 
    this.setter.setState({
      recommendationCode: event.target.value
    })
  }
 
  renderButtonText() {
    const { buttonText } = this.props;

    if (!buttonText && this.isLogin) {
      return 'Login';
    }

    if (!buttonText && this.isSignup) {
      return 'Signup';
    }

    return buttonText;
  }
  onChangeAgree=()=>{
    console.log(this.state.agree);
    this.setter.setState({
      agree:!this.state.agree
    });
  }
  
  render() {
    const {
      showLogo,
      usernameInputProps,
      passwordInputProps,
      confirmPasswordInputProps,
      children,
      onLogoClick,
  recommendationCodeInputProps
    } = this.props;
    if(this.state.inProgress){
      return (
        <PageSpinner />
      );
    }else{
      if(!this.isPhone && !this.isVerify)
      {
        return (
          <Form onSubmit={this.handleSubmit}>
            {showLogo && (
              <div className="text-center pb-4">
                <img
                  src={logo200Image}
                  className="rounded"
                  style={{ width: 300, height: 50, cursor: 'pointer' }}
                  alt="logo"
                  onClick={onLogoClick}
                />
              </div>
            )}
            <FormGroup>
              <Input {...usernameInputProps} onChange={this.changePhone} value={this.state.phone} />
            </FormGroup>
            <FormGroup>
              <Input {...passwordInputProps} onChange={this.changePassword} value={this.state.password} />
            </FormGroup>
            {this.isSignup && (
              <FormGroup>
                <Input {...confirmPasswordInputProps} onChange={this.changeConfirmPassword} value={this.state.confirmPassword}  />
                {
                  this.state.confirmPWDErr && (
                    <span className='text-danger'>password not match</span>
                  )
                }
              </FormGroup>
    
            )}
                  {/* {this.isSignup && (
            
              <FormGroup>
              <Label for={verificationCodeLabel}>{verificationCodeLabel}</Label>
              <Input {...verificationCodeInputProps} />
            </FormGroup>
            
            )} */}
                  {this.isSignup && (
            <>
     
              <FormGroup>
                <Input type='text' {...recommendationCodeInputProps} value={this.state.recommendationCode} onChange={this.changeRecommendationCdoe} />
              </FormGroup>
            </>
            )}
            { this.isSignup && (
            <FormGroup check>
              <Label check>
                <Input type="checkbox" checked={this.state.agree} onChange={this.onChangeAgree} />{' '}
                Agree the <Link to='/policy'>terms and policy</Link>
              </Label>
            </FormGroup> 
            )}
            <hr />
           
                <Button
                  size="lg"
                  className="bg-gradient-theme-left border-0"
                  block
                  onClick={this.handleSubmit}>
                  {this.renderButtonText()}
                </Button>
            
    
            { <div className="text-center pt-1">
              <h6>or</h6>
              <h6>
                {              
                  this.isSignup ? (
                    <a href="#login" onClick={this.changeAuthState(STATE_LOGIN)}>
                      Login
                    </a>
                  ) : (
                    <>
                      <a href="#signup" onClick={this.changeAuthState(STATE_SIGNUP)}>
                        Signup
                      </a>
                      <br></br>
                      <br></br>
                      <a href="#signup" onClick={this.changeAuthState(STATE_PHONE)}>
                        Forgot password.
                      </a>
                      <br />
                      <br />
                      <a href="https://t.me/colortrading247">
                        Contact US
                      </a>

                      
                    </>
                  )                
                }
            
              </h6>
            </div> }
    
            {children}
            <NotificationSystem
              dismissible={false}
              ref={notificationSystem =>
                (this.notificationSystem = notificationSystem)
              }
              style={NOTIFICATION_SYSTEM_STYLE}
            />
          </Form>
        );
      }
      else{
        return (
          <Form>
            {showLogo && (
              <div className="text-center pb-4">
                <img
                  src={logo200Image}
                  className="rounded"
                  style={{ width: 300, height: 50, cursor: 'pointer' }}
                  alt="logo"
                  onClick={onLogoClick}
                />
              </div>
            )}
            
            {
              (this.isPhone) ? (
                <FormGroup>
                  <Input  type='text' placeholder='Please type your phone number' value={this.state.phone} onChange={this.changePhone} />
                </FormGroup>
              ) : (
                <>
                <FormGroup>
                  <Button onClick={this.sendOTP} color="success" >{this.otpProgress ? (<PageSpinner />) : 'Resend OTP'}</Button>
                </FormGroup>
                <FormGroup>
                  <Input  type='text' placeholder='Please type the letters on your phone.' value={this.state.verify} onChange={this.changeVerify} />
                </FormGroup>
                </>
              )
            }
            
            
            <hr />
            {
              this.isPhone ? 
                  (<Button
                  size="lg"
                  className="bg-gradient-theme-left border-0"
                  block
                  onClick={this.handleSubmit}>
                  OK
                  </Button>) : (
                    <Button
                    size="lg"
                    className="bg-gradient-theme-left border-0"
                    block
                    onClick={this.handleSubmit}>
                    Verify
                    </Button>
                  )

            
            }


    
        
    
            {children}
            <NotificationSystem
              dismissible={false}
              ref={notificationSystem =>
                (this.notificationSystem = notificationSystem)
              }
              style={NOTIFICATION_SYSTEM_STYLE}
            />
          </Form>
        );
      }
    }
    
  }
}

export const STATE_LOGIN = 'LOGIN';
export const STATE_SIGNUP = 'SIGNUP';
export const STATE_PHONE = 'PHONE';
export const STATE_VERIFY = 'VERIFY';
AuthForm.propTypes = {
  authState: PropTypes.oneOf([STATE_LOGIN, STATE_SIGNUP]).isRequired,
  showLogo: PropTypes.bool,
  usernameLabel: PropTypes.string,
  usernameInputProps: PropTypes.object,
  passwordLabel: PropTypes.string,
  passwordInputProps: PropTypes.object,
  confirmPasswordLabel: PropTypes.string,
  confirmPasswordInputProps: PropTypes.object,
  // verificationCodeLabel: PropTypes.string,
  // verificationCodeInputProps: PropTypes.object,
  recommendationCodeLabel: PropTypes.string,
  recommendationCodeInputProps: PropTypes.object,
  onLogoClick: PropTypes.func,
};

AuthForm.defaultProps = {
  authState: 'LOGIN',
  showLogo: true,
  usernameLabel: 'Phone',
  usernameInputProps: {
    type: 'string',
    placeholder: 'your phone number',
  },
  passwordLabel: 'Password',
  passwordInputProps: {
    type: 'password',
    placeholder: 'your password',
  },
  confirmPasswordLabel: 'Confirm Password',
  confirmPasswordInputProps: {
    type: 'password',
    placeholder: 'confirm your password',
  },
  recommendationCodeLabel: 'Recommendation Code',
  recommendationCodeInputProps: {
    type: 'string',
    placeholder: 'recommendation code',
  },

  onLogoClick: () => {},
};

export default AuthForm;
