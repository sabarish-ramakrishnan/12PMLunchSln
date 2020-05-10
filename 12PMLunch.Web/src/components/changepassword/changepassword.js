import React, { Component } from 'react';
import './changepassword.css';
import Input from '../common/Input/Input';
import AppUserActions from '../../actions/AppUserActions';
import common from '../../common/common';
import Spinner from '../../components/common/Spinner/Spinner'
import ErrorComponent from '../../components/common/ErrorComponent/ErrorComponent'
import { withRouter } from "react-router-dom";
import UserApi from '../../api/UserApi';
import BootStrapModal from '../../components/common/BootstrapModal/BootstrapModal'
import AppConstants from '../../constants/AppConstants'

class changepassword extends Component {
    componentWillMount() {
        this.props.headerBanner(false);
    }
    state = {
        signupform: {
            oldpassword: {
                elementtype: 'input',
                elementconfig: {
                    type: 'password',
                    placeholder: 'Password'
                },
                elementClass: 'form-control',
                value: '',
                label: 'Old Password',
                validation: {
                    required: {
                        message: 'Old Password is required'
                    }
                },
                valid: true,
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
                label: 'New Password',
                validation: {
                    required: {
                        message: 'New Password is required'
                    },
                    minLength: {
                        len: 8,
                        message: 'New Password should have atleast 8 characters'
                    }
                },
                valid: true,
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
                label: 'Confirm New Password',
                validation: {
                    required: {
                        message: 'Confirm New Password is required'
                    },
                    compare: {
                        value: 'password',
                        message: 'Both New Password & Confirm New Password should match'
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
        success: false,
        oldpasswordNotMatch: false
    }
    componentDidMount = () => {
        if (!common.isAuthenticated())
            this.props.history.push('/login');
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

    chgPasswordHandler = () => {
        let user = {
            OldPassword: common.encodeStr(this.state.signupform.oldpassword.value),
            NewPassword: common.encodeStr(this.state.signupform.password.value),
            UserId: common.getTokenValue(AppConstants.USER_ID)
        };
        this.setState({ loading: true, error: false, oldpasswordNotMatch: false });
        UserApi.updateUserPassword(user)
            .then((response) => {
                const responseData = response.body;
                if (response.status != 200)
                    this.setState({ error: true, loading: false });
                else if (!responseData || responseData == null) {
                    console.log('User not found');
                    this.setState({ error: true, loading: false });
                }
                else if (responseData.PasswordMatch.toString().toUpperCase() === 'FALSE') {
                    this.setState({ loading: false, oldpasswordNotMatch: true });
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
                <button className="btn btn-success" type="button" onClick={this.chgPasswordHandler} disabled={!this.state.formIsValid}>Update</button>
                &nbsp;&nbsp;<button className="btn btn-success" type="button" onClick={this.cancelHandler}>Cancel</button>
            </form>
        );

        return (
            <div className="container ContactData">
                <div className="row" style={{paddingLeft:'15px',marginBottom:'20px'}}>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <label className="h2">Change Password</label>
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
                        <ErrorComponent show={this.state.oldpasswordNotMatch}>
                            Old password does not match. Please make sure you enter exact password.
                        </ErrorComponent>
                    </div>
                </div>
                <Spinner show={this.state.loading && !this.state.error} />
                <BootStrapModal showModal={this.state.success} titleText="12PM Lunch" modalClassName="alertModal"
                    confirmHandler={this.closeModal} confirmButtonText="Ok">
                    <label>Password updated successfully</label>
                </BootStrapModal>
            </div>
        )

    }
}
export default withRouter(changepassword);