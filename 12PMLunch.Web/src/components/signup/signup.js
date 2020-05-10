import React, { Component } from 'react';
import './signup.css';
import Input from '../common/Input/Input';
import AppUserActions from '../../actions/AppUserActions';
import common from '../../common/common';
import Spinner from '../../components/common/Spinner/Spinner'
import ErrorComponent from '../../components/common/ErrorComponent/ErrorComponent'
import UserApi from '../../api/UserApi';
import BootStrapModal from '../../components/common/BootstrapModal/BootstrapModal'
import { withRouter } from 'react-router-dom'

class signup extends Component {
    state = {
        signupform: {
            firstname: {
                elementtype: 'input',
                elementconfig: {
                    type: 'text',
                    placeholder: 'First Name'
                },
                elementClass: 'form-control',
                value: '',
                label: 'First Name',
                validation: {
                    required: {
                        message: 'First Name is required'
                    }
                },
                valid: false,
                touched: false,
                errorMessages: []
            },
            lastname: {
                elementtype: 'input',
                elementconfig: {
                    type: 'text',
                    placeholder: 'Last Name'
                },
                elementClass: 'form-control',
                value: '',
                label: 'Last Name',
                validation: {
                    required: {
                        message: 'Last Name is required'
                    }
                },
                valid: false,
                touched: false,
                errorMessages: []
            },
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
                    },
                    minLength: {
                        len: 8,
                        message: 'Password should have atleast 8 characters'
                    }
                },
                valid: false,
                touched: false,
                errorMessages: []
            },
            confirmpassword: {
                elementtype: 'input',
                elementconfig: {
                    type: 'password',
                    placeholder: 'Confirm Password'
                },
                elementClass: 'form-control',
                value: '',
                label: 'Confirm Password',
                validation: {
                    required: {
                        message: 'Confirm Password is required'
                    },
                    compare: {
                        value: 'password',
                        message: 'Both Password & Confirm Password should match'
                    }
                },
                valid: false,
                touched: false,
                errorMessages: []
            },
            phone: {
                elementtype: 'input',
                elementconfig: {
                    placeholder: 'xxx xxx xxxx',
                    rows: 3
                },
                elementClass: 'form-control',
                value: '',
                label: 'Mobile',
                validation: {
                    minLength: {
                        len: 10,
                        message: 'Mobile should have atleast 10 characters'
                    },
                    maxLength: {
                        len: 10,
                        message: 'Mobile should be maximum 10 characters'
                    },
                    required: {
                        message: 'Mobile is required'
                    },
                    isNumeric: {
                        message: 'Mobile should be numeric'
                    }
                },
                valid: false,
                touched: false,
                errorMessages: []
            }
        },
        loading: false,
        error: false,
        success: false,
        userAlreadyExists: false
    }
    componentWillMount() {
        this.props.headerBanner(false);
    }
    inputChangedHandler = (event, inputIdentifier) => {
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

    signupHandler = () => {
        let user = {
            FirstName: this.state.signupform.firstname.value,
            LastName: this.state.signupform.lastname.value,
            Password: this.state.signupform.password.value,
            EmailId: this.state.signupform.email.value,
            Mobile: this.state.signupform.phone.value,
            UpdatedBy: this.state.signupform.email.value,
            UserRole: 1
        };
        this.setState({ loading: true, error: false });
        UserApi.submitUser(user)
            .then((response) => {
                //debugger;
                const responseData = response.body;
                if (response.status != 200)
                    this.setState({ error: true, loading: false });
                else if (!responseData || responseData == null) {
                    //console.log('User not found');
                    this.setState({ error: true, loading: false });
                }
                else if (responseData.UserAlreadyExists.toString().toUpperCase() === 'TRUE') {
                    this.setState({ loading: false, userAlreadyExists: true });
                }
                else
                    this.setState({ loading: false, success: true });
            }).catch((err) => {
                console.log(err);
                this.setState({ loading: false, error: true });
            });
    }

    closeModal = () => {
        this.props.history.push('/login');
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
            <form className="col-xs-10 col-sm-10 col-md-10">
                {
                    formElementsArray.map(formElement => (
                        <div className="form-group" key={formElement.id}>
                            <Input
                                key={formElement.id}
                                elementtype={formElement.config.elementtype}
                                elementconfig={formElement.config.elementconfig}
                                value={formElement.config.value}
                                inputClassName={formElement.config.elementClass}
                                changed={(event) => this.inputChangedHandler(event, formElement.id)}
                                invalid={!formElement.config.valid}
                                touched={formElement.config.touched}
                                shouldValidate={formElement.config.validation}
                                errorMessages={formElement.config.errorMessages}
                            >{formElement.config.label}</Input>
                        </div>
                    ))
                }
                {/*  */}
                <button className="btn btn-success clickable" type="button"
                    onClick={this.signupHandler} disabled={!this.state.formIsValid}
                    title={!this.state.formIsValid ? 'Please enter all fields. Button will be enabled once you enter all fields' : 'Submit'}>
                    Sign Up</button>
            </form>
        );

        return (
            <div className="container ContactData">
                <div className="row" style={{paddingLeft:'15px',marginBottom:'20px'}}>
                    <div className="col-xs-12 col-md-12 col-sm-12">
                        <label className="h2">Sign Up</label>
                        <span className='small' style={{ marginLeft: '20px', color: 'Red' }}>All fields are mandatory.</span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-md-6 col-sm-12">
                        {form}
                    </div>
                </div>
                <div className="row" style={{paddingLeft:'15px',paddingTop:'10px'}}>
                    <div className="col-xs-12 col-md-12 col-sm-12">
                        <ErrorComponent show={this.state.error} />
                        <ErrorComponent show={this.state.userAlreadyExists}>
                            Email Id already exists. Please use a different email id.
                        </ErrorComponent>
                    </div>
                </div>
                <Spinner show={this.state.loading && !this.state.error} type='saving' />
                <BootStrapModal showModal={this.state.success} titleText="12PM Lunch" modalClassName="alertModal"
                    confirmHandler={this.closeModal} confirmButtonText="Ok">
                    {/* <label>Thank you for signing up. You will receive an email shortly at registered email. Please follow the instructions.</label> */}
                    <label>Thank you for signing up. A confirmation is sent to your registered email.</label>
                </BootStrapModal>
            </div>
        )

    }
}
export default withRouter(signup);