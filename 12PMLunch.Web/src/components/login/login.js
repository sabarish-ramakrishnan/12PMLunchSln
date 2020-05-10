import React, { Component } from 'react';
import './login.css';
import Input from '../common/Input/Input';
import UserApi from '../../api/UserApi';
import { Redirect } from 'react-router-dom';
import AppConstants from '../../constants/AppConstants';
import common from '../../common/common'
import { Link, withRouter } from 'react-router-dom'
import toast from '../../common/toast';
import BootStrapModal from '../../components/common/BootstrapModal/BootstrapModal'
import Spinner from '../../components/common/Spinner/Spinner'
import ErrorComponent from '../../components/common/ErrorComponent/ErrorComponent'
import AppOrderActions from '../../actions/AppOrderActions';

class login extends Component {
    componentWillMount() {
        this.props.headerBanner(false);
    }
    state = {
        signupform: {
            email: {
                elementtype: 'input',
                elementconfig: {
                    type: 'text',
                    placeholder: 'Email'
                },
                elementClass: 'form-control',
                value: '',
                label: 'Email (UserName)',
                validation: {
                    required: {
                        message: 'Email is required'
                    },
                    isEmail: {
                        message: 'Please enter valid email'
                    }
                },
                valid: false,
                touched: false,
                errorMessages: []
            },
            password: {
                elementtype: 'input',
                elementconfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                elementClass: 'form-control',
                value: '',
                label: 'Password',
                validation: {
                    required: {
                        message: 'Password is required'
                    }
                },
                valid: false,
                touched: false,
                errorMessages: []
            }
        },
        loading: false,
        error: false,
        loginFailed: false,
        emailNotVerified: false
    }

    inputChangedHandler = (event, inputIdentifier) => {
        //debugger;
        const updatedSignupForm = {
            ...this.state.signupform
        };
        const updatedFormElement = {
            ...updatedSignupForm[inputIdentifier]
        };

        updatedFormElement.value = event.target.value;
        updatedFormElement.touched = true;

        let validationResult = null;
        if (updatedFormElement.validation) {
            validationResult = common.checkValidity(updatedFormElement, updatedSignupForm);
            updatedFormElement.valid = validationResult.valid;
            updatedFormElement.errorMessages = validationResult.errorMessages;
        }

        //updatedFormElement.valid = this.checkValidity(updatedFormElement.inputIdentifier, updatedFormElement.value, updatedFormElement.validation);

        updatedSignupForm[inputIdentifier] = updatedFormElement;

        let formIsValid = true;
        for (let inputIdentifier in updatedSignupForm) {
            formIsValid = updatedSignupForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({ signupform: updatedSignupForm, formIsValid: formIsValid });
        //console.log(this.state);
    }

    loginHandler = (event) => {
        event.preventDefault();
        const encodedUserName = new Buffer(this.state.signupform.email.value).toString('base64');
        const encodedPassword = new Buffer(this.state.signupform.password.value).toString('base64');
        let user = {
            Password: encodedPassword,
            EmailId: encodedUserName,
        };
        this.setState({ loading: true, error: false, loginFailed: false, emailNotVerified: false });
        UserApi.authenticateUser(user)
            .then(response => {
                //debugger;
                //console.log('Request succeeded with JSON response', response);
                let responseData = response.body;
                if (response.status != 200)
                    this.setState({ error: true, loading: false });
                else if (!responseData || responseData == null) {
                    //console.log('User not found');
                    this.setState({ loginFailed: true, loading: false });
                }
                else if (responseData.EmailVerified.toString().toUpperCase() === 'TRUE') {
                    //console.log('Logged in');
                    localStorage.setItem(AppConstants.LOGIN_TOKEN, responseData.LoginToken);
                    localStorage.setItem(AppConstants.LOGIN_TOKEN_EXPIRY, responseData.LoginTokenExpiry);
                    localStorage.setItem(AppConstants.EMAIL_ID, responseData.EmailId);
                    localStorage.setItem(AppConstants.USER_ID, responseData.UserId);
                    localStorage.setItem(AppConstants.USER_ROLE, responseData.UserRole);
                    //this.setState();
                    //window.location.reload();
                    let reqObject = {
                        currentUser: responseData.EmailId
                    }
                    AppOrderActions.getAllOrders(reqObject);

                    this.props.history.push('/');
                }
                else if (responseData.EmailVerified.toString().toUpperCase() === 'FALSE') {
                    //console.log('Email not verfied');
                    this.setState({ emailNotVerified: true, loading: false });
                }

                //this.toggleLoading();
            })
            .catch(err => {
                this.setState({ error: true, loading: false });
                console.log("fetch error" + err);
            });
    }
    render() {
        const formElementsArray = [];
        for (let key in this.state.signupform) {
            formElementsArray.push({
                id: key,
                config: this.state.signupform[key]
            });
        }
        let form = (

            <form className="col-xs-10 col-sm-10 col-md-10" onSubmit={this.loginHandler}>
                {/* onSubmit={this.loginHandler} */}
                {
                    formElementsArray.map(formElement => (
                        <div className="form-group" key={formElement.id}>
                            <Input

                                elementtype={formElement.config.elementtype}
                                elementconfig={formElement.config.elementconfig}
                                value={formElement.config.value}
                                inputClassName={formElement.config.elementClass}
                                changed={(event) => this.inputChangedHandler(event, formElement.id)}
                                invalid={!formElement.config.valid}
                                touched={formElement.config.touched}
                                shouldValidate={formElement.config.validation}
                                errorMessages={formElement.config.errorMessages}
                            >{formElement.config.label}</Input></div>
                    ))
                }
                {/* onClick={this.signupHandler} */}
                <button className="btn btn-success clickable" type="submit" disabled={!this.state.formIsValid} >Login</button>
            </form>



        );
        let pageContent = null;
        if (common.isAuthenticated())
            pageContent = <Redirect to='/' />;
        else
            pageContent = form;
        return (
            <div className="container ContactData">
                <div className="row" style={{paddingLeft:'15px',marginBottom:'20px'}}>
                    <div className="col-xs-12 col-md-12 col-sm-12">
                        <label className="h2">Login</label>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-md-6 col-sm-12">
                        {pageContent}
                    </div>
                </div>
                <div className="row" style={{marginTop:'10px',paddingLeft:'15px'}}>
                    <div className="col-xs-12 col-md-8 col-sm-12">
                        Not a Member? <Link to='/signup' className="clickable">Click Here</Link> to Signup.
                    </div>
                </div>
                <div className="row" style={{marginTop:'10px',paddingLeft:'15px'}}>
                    <div className="col-xs-12 col-md-8 col-sm-12">
                        Forgot Password? <Link to='/forgotpassword' className="clickable">Click Here</Link> to reset.
                    </div>
                </div>
                <div className="row" style={{paddingLeft:'15px',paddingTop:'10px'}}>
                    <div className="col-xs-12 col-md-12 col-sm-12">
                        <ErrorComponent show={this.state.error} />
                        <ErrorComponent show={this.state.loginFailed} >
                            Login failed. Please enter valid user id and password.
                        </ErrorComponent>
                        <ErrorComponent show={this.state.emailNotVerified} >
                            Your email is not verified. Please check your email and follow the instructions to confirm your email.
                        </ErrorComponent>
                    </div>
                </div>
                <Spinner show={this.state.loading && !this.state.error} type='custom' >
                    Logging in. Please wait...
                </Spinner>
            </div>
        )

    }
}
export default withRouter(login);