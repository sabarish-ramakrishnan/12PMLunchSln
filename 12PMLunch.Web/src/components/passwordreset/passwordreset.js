import React, { Component } from 'react';
import './passwordreset.css';
import Input from '../common/Input/Input';
import AppUserActions from '../../actions/AppUserActions';
import common from '../../common/common';
import Spinner from '../../components/common/Spinner/Spinner'
import ErrorComponent from '../../components/common/ErrorComponent/ErrorComponent'
import { withRouter } from "react-router-dom";
import UserApi from '../../api/UserApi';
import BootStrapModal from '../../components/common/BootstrapModal/BootstrapModal'
import AppConstants from '../../constants/AppConstants'

class passwordreset extends Component {
    componentWillMount() {
        this.props.headerBanner(false);
    }
    state = {
        passwordresetform: {
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
        InformationNotExists: false
    }
    constructor(props) {
        super(props);
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedpasswordresetform = {
            ...this.state.passwordresetform
        };
        const updatedFormElement = {
            ...updatedpasswordresetform[inputIdentifier]
        };

        updatedFormElement.value = event.target.value;
        updatedFormElement.touched = true;

        let validationResult = null;
        if (updatedFormElement.validation) {
            validationResult = common.checkValidity(updatedFormElement, updatedpasswordresetform);
            //console.log(validationResult);
            updatedFormElement.valid = validationResult.valid;
            updatedFormElement.errorMessages = validationResult.errorMessages;
        }

        //updatedFormElement.valid = this.checkValidity(updatedFormElement.inputIdentifier, updatedFormElement.value, updatedFormElement.validation);

        updatedpasswordresetform[inputIdentifier] = updatedFormElement;

        let formIsValid = true;
        for (let inputIdentifier in updatedpasswordresetform) {
            formIsValid = updatedpasswordresetform[inputIdentifier].valid && formIsValid;
        }
        this.setState({ passwordresetform: updatedpasswordresetform, formIsValid: formIsValid });
        //console.log(this.state);
    }

    passwordresetHandler = () => {
        const encodedUserName = this.props.match.params.emailId;
        const encodedToken = this.props.match.params.regToken;
        let user = {
            EncodedRegToken: encodedToken,
            Password: common.encodeStr(this.state.passwordresetform.password.value),
            EmailId: encodedUserName
        };
        this.setState({ loading: true, error: false, InformationNotExists: false });
        UserApi.passwordResetConfirm(user)
            .then((response) => {
                const responseData = response.body;
                if (response.status != 200)
                    this.setState({ error: true, loading: false });
                else if (!responseData || responseData == null) {
                    console.log('User not found');
                    this.setState({ error: true, loading: false });
                }
                else if (responseData.PasswordReset.toString().toUpperCase() === 'FALSE') {
                    this.setState({ loading: false, InformationNotExists: true });
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
        this.props.history.push("/login");
    }

    render() {
        const formElementsArray = [];
        for (let key in this.state.passwordresetform) {
            formElementsArray.push({
                id: key,
                config: this.state.passwordresetform[key]
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
                <button className="btn btn-success" type="button" onClick={this.passwordresetHandler} disabled={!this.state.formIsValid}>Update</button>
            </form>
        );

        return (
            <div className="container ContactData">
                <div className="row" style={{ paddingLeft: '15px', marginBottom: '20px' }}>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <label className="h2">Change Password</label>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-6 col-md-8 col-sm-12">
                        {form}
                    </div>
                </div>
                <div className="row" style={{ paddingLeft: '15px', paddingTop: '10px' }}>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <ErrorComponent show={this.state.error} />
                        <ErrorComponent show={this.state.InformationNotExists} >
                            Password not updated. User does not exists.
                        </ErrorComponent>
                    </div>
                </div>
                <Spinner show={this.state.loading && !this.state.error} />
                <BootStrapModal showModal={this.state.success} titleText="12PM Lunch" modalClassName="alertModal"
                    confirmHandler={this.closeModal} confirmButtonText="Ok">
                    <label>Your password is updated.</label>
                </BootStrapModal>
            </div>
        )

    }
}
export default withRouter(passwordreset);