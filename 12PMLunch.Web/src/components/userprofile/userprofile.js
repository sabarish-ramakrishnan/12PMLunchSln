import React, { Component } from 'react';
import './userprofile.css';
import Input from '../common/Input/Input';
import AppUserActions from '../../actions/AppUserActions';
import common from '../../common/common';
import Spinner from '../../components/common/Spinner/Spinner'
import ErrorComponent from '../../components/common/ErrorComponent/ErrorComponent'
import { withRouter } from "react-router-dom";
import UserApi from '../../api/UserApi';
import BootStrapModal from '../../components/common/BootstrapModal/BootstrapModal'

class userprofile extends Component {
    componentWillMount() {
        this.props.headerBanner(false);
    }
    state = {
        signupform: {
            email: {
                elementtype: 'label',
                elementClass: 'form-label',
                value: '',
                label: 'Email (UserName)',
                elementconfig: {
                    type: '',
                    placeholder: ''
                },
                valid: true
            },
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
                valid: true,
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
                valid: true,
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
                valid: true,
                touched: false,
                errorMessages: []
            }
        },
        loading: false,
        error: false,
        formIsValid: true,
        success: false
    }
    componentDidMount = () => {
        if (common.isAuthenticated())
            this.loadUserProfile();
        else
            this.props.history.push('/login');
    }
    loadUserProfile = () => {
        let reqObject = {
            email: common.getcurrentUserEmail()
        }
        this.setState({ loading: true });
        UserApi.getUserByEmail(reqObject)
            .then((response) => {
                const responseData = response.body;
                if (response.status != 200)
                    this.setState({ error: true, loading: false });
                else if (!responseData || responseData == null) {
                    console.log('User not found');
                    this.setState({ error: true, loading: false });
                }
                else {
                    const updatedSignupForm = {
                        ...this.state.signupform
                    };
                    updatedSignupForm.firstname.value = responseData.FirstName;
                    updatedSignupForm.lastname.value = responseData.LastName;
                    updatedSignupForm.email.value = responseData.EmailId;
                    updatedSignupForm.phone.value = responseData.Mobile;
                    this.setState({ loading: false, signupform: updatedSignupForm });
                }
            }).catch((err) => {
                console.log(err);
                this.setState({ loading: false, error: true });
            });
        //this.setState({ loading: false, error: true });
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
            //console.log(validationResult);
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
            EmailId: this.state.signupform.email.value,
            Mobile: this.state.signupform.phone.value,
            UpdatedBy: this.state.signupform.email.value
        };
        this.setState({ loading: true });
        UserApi.updateUser(user)
            .then((response) => {
                const responseData = response.body;
                if (response.status != 200)
                    this.setState({ error: true, loading: false });
                else if (!responseData || responseData == null) {
                    console.log('User not found');
                    this.setState({ error: true, loading: false });
                }
                else
                    this.setState({ loading: false, success: true });
            }).catch((err) => {
                console.log(err);
                this.setState({ loading: false, error: true });
            });
    }
    cancelHandler = () => {
        this.props.history.push("/");
    }
    closeModal = () => {
        this.setState({ success: false });
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
            <form className="col-md-10">
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
                <button className="btn btn-success clickable" type="button" onClick={this.signupHandler} disabled={!this.state.formIsValid}>Update</button>
                &nbsp;&nbsp;<button className="btn btn-success" type="button" onClick={this.cancelHandler}>Cancel</button>
            </form>
        );

        return (
            <div className="container ContactData">
                <div className="row" style={{paddingLeft:'15px',marginBottom:'20px'}}>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <label className="h2">My Profile</label>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6 col-md-8 col-sm-12">
                        {form}
                    </div>
                </div>
                <div className="row" style={{paddingLeft:'15px',paddingTop:'10px'}}>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <ErrorComponent show={this.state.error} />
                    </div>
                </div>
                <Spinner show={this.state.loading && !this.state.error} />
                <BootStrapModal showModal={this.state.success} titleText="12PM Lunch" modalClassName="alertModal"
                    confirmHandler={this.closeModal} confirmButtonText="Ok">
                    <label>User profile updated successfully</label>
                </BootStrapModal>
            </div>
        )

    }
}
export default userprofile;