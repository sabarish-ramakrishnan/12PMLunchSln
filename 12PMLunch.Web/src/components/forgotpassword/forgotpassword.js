import React, { Component } from 'react';
import './forgotpassword.css';
import Input from '../common/Input/Input';
import AppUserActions from '../../actions/AppUserActions';
import common from '../../common/common';
import Spinner from '../../components/common/Spinner/Spinner'
import ErrorComponent from '../../components/common/ErrorComponent/ErrorComponent'
import UserApi from '../../api/UserApi';
import BootStrapModal from '../../components/common/BootstrapModal/BootstrapModal'
import { withRouter } from 'react-router-dom'

class forgotpassword extends Component {
    state = {
        forgotpasswordform: {
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
            }
        },
        loading: false,
        error: false,
        success: false,
        UserNotExists: false
    }
    componentWillMount() {
        this.props.headerBanner(false);
    }
    inputChangedHandler = (event, inputIdentifier) => {
        const updatedForgotPasswordForm = {
            ...this.state.forgotpasswordform
        };
        const updatedFormElement = {
            ...updatedForgotPasswordForm[inputIdentifier]
        };

        updatedFormElement.value = event.target.value;
        updatedFormElement.touched = true;

        let validationResult = null;
        if (updatedFormElement.validation) {
            validationResult = common.checkValidity(updatedFormElement, updatedForgotPasswordForm);
            updatedFormElement.valid = validationResult.valid;
            updatedFormElement.errorMessages = validationResult.errorMessages;
        }

        //updatedFormElement.valid = this.checkValidity(updatedFormElement.inputIdentifier, updatedFormElement.value, updatedFormElement.validation);

        updatedForgotPasswordForm[inputIdentifier] = updatedFormElement;

        let formIsValid = true;
        for (let inputIdentifier in updatedForgotPasswordForm) {
            formIsValid = updatedForgotPasswordForm[inputIdentifier].valid && formIsValid;
        }
        this.setState({ forgotpasswordform: updatedForgotPasswordForm, formIsValid: formIsValid });
        //console.log(this.state);
    }

    forgotPasswordHandler = () => {
        let user = {
            EmailId: common.encodeStr(this.state.forgotpasswordform.email.value)
        };
        this.setState({ loading: true, error: false, UserNotExists: false });
        UserApi.forgotPassword(user)
            .then((response) => {
                //debugger;
                const responseData = response.body;
                if (response.status != 200)
                    this.setState({ error: true, loading: false });
                else if (!responseData || responseData == null) {
                    //console.log('User not found');
                    this.setState({ error: true, loading: false });
                }
                else if (responseData.UserExists.toString().toUpperCase() === 'FALSE') {
                    this.setState({ loading: false, UserNotExists: true });
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
        for (let key in this.state.forgotpasswordform) {
            formElementsArray.push({
                id: key,
                config: this.state.forgotpasswordform[key]
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
                    onClick={this.forgotPasswordHandler} disabled={!this.state.formIsValid}
                    title={!this.state.formIsValid ? 'Please enter all fields. Button will be enabled once you enter all fields' : 'Submit'}>
                    Submit</button>
            </form>
        );
        return (
            <div className="container ContactData">
                <div className="row" style={{ paddingLeft: '15px', marginBottom: '20px' }}>
                    <div className="col-xs-12 col-md-12 col-sm-12">
                        <label className="h2">Forgot Password</label>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-md-6 col-sm-12">
                        {form}
                    </div>
                </div>
                <div className="row" style={{ paddingLeft: '15px', paddingTop: '10px' }}>
                    <div className="col-xs-12 col-md-12 col-sm-12">
                        <ErrorComponent show={this.state.error} />
                        <ErrorComponent show={this.state.UserNotExists}>
                            User does not exists. Please use a different email id.
                        </ErrorComponent>
                    </div>
                </div>
                <Spinner show={this.state.loading && !this.state.error} type='saving' />
                <BootStrapModal showModal={this.state.success} titleText="12PM Lunch" modalClassName="alertModal"
                    confirmHandler={this.closeModal} confirmButtonText="Ok">
                    <label>Password reset email is sent to your registered email. Please follow the instructions mentioned in email.</label>
                </BootStrapModal>
            </div>
        )

    }
}
export default withRouter(forgotpassword);