import React, { Component } from 'react';
import './feedback.css';
import Input from '../common/Input/Input';
import AppFeedbackActions from '../../actions/AppFeedbackActions';
import AppUserStore from '../../stores/AppUserStore';
import common from '../../common/common';
import Spinner from '../../components/common/Spinner/Spinner'
import ErrorComponent from '../../components/common/ErrorComponent/ErrorComponent'
import FeedbackApi from '../../api/FeedbackApi';
import BootStrapModal from '../../components/common/BootstrapModal/BootstrapModal'

class feedback extends Component {
    componentWillMount() {
        this.props.headerBanner(false);
    }
    state = {
        feedbackform: {
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
                label: 'Email',
                validation: {
                    isEmail: {
                        message: 'Please enter valid email'
                    }
                },
                valid: false,
                touched: false,
                errorMessages: []
            },
            feedbacktype: {
                elementtype: 'select',
                elementconfig: {
                    options: [
                        { value: '', displayValue: 'Select' },
                        { value: '1', displayValue: 'General' },
                        { value: '2', displayValue: 'Service' },
                        { value: '3', displayValue: 'Packing' },
                        { value: '4', displayValue: 'Delivery' },
                        { value: '5', displayValue: 'Wait time' },
                        { value: '6', displayValue: 'Hours of operation' },
                        { value: '7', displayValue: 'Cleanliness' },
                        { value: '8', displayValue: 'Product/Freshness Quality' },
                        { value: '9', displayValue: 'Price' },
                        { value: '10', displayValue: 'Other, please specify in comments' }
                        
                    ]
                },
                elementClass: 'form-control',
                value: '',
                label: 'FeedBack Type',
                validation: {
                    required: {
                        message: 'FeedBack Type is required'
                    }
                },
                valid: false,
                touched: false,
                errorMessages: []
            },
            rating: {
                elementtype: 'select',
                elementconfig: {
                    options: [
                        { value: '', displayValue: 'Select' },
                        { value: '5', displayValue: '5 Stars' },
                        { value: '4', displayValue: '4 Stars' },
                        { value: '3', displayValue: '3 Stars' },
                        { value: '2', displayValue: '2 Stars' },
                        { value: '1', displayValue: '1 star' }
                    ]
                },
                elementClass: 'form-control',
                value: '',
                label: 'Rating',
                validation: {
                    required: {
                        message: 'Rating is required'
                    }
                },
                valid: false,
                touched: false,
                errorMessages: []
            },
            feedback: {
                elementtype: 'textarea',
                elementconfig: {
                    type: 'text',
                    placeholder: 'Enter your feedback',
                    rows: 5
                },
                elementClass: 'form-control',
                value: '',
                label: 'Comments',
                validation: {
                    required: {
                        message: 'Comments is required'
                    },
                    maxLength: {
                        len: 4000,
                        message: 'Comments can have maximum of 4000 characters'
                    }
                },
                valid: false,
                touched: false,
                errorMessages: []
            }
        },
        loading: false,
        error: false
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedfeedbackform = {
            ...this.state.feedbackform
        };
        const updatedFormElement = {
            ...updatedfeedbackform[inputIdentifier]
        };

        updatedFormElement.value = event.target.value;
        updatedFormElement.touched = true;

        let validationResult = null;
        if (updatedFormElement.validation) {
            validationResult = common.checkValidity(updatedFormElement, updatedfeedbackform);
            updatedFormElement.valid = validationResult.valid;
            updatedFormElement.errorMessages = validationResult.errorMessages;
        }

        //updatedFormElement.valid = this.checkValidity(updatedFormElement.inputIdentifier, updatedFormElement.value, updatedFormElement.validation);

        updatedfeedbackform[inputIdentifier] = updatedFormElement;

        let formIsValid = true;
        for (let inputIdentifier in updatedfeedbackform) {
            formIsValid = updatedfeedbackform[inputIdentifier].valid && formIsValid;
        }
        this.setState({ feedbackform: updatedfeedbackform, formIsValid: formIsValid });
        //console.log(this.state);
    }

    feedbackHandler = () => {
        let userfeedback = {
            Name: this.state.feedbackform.firstname.value + ' ' + this.state.feedbackform.lastname.value,
            Email: this.state.feedbackform.email.value,
            FeedbackType: this.state.feedbackform.feedbacktype.value,
            Comments: this.state.feedbackform.feedback.value,
            rating: this.state.feedbackform.rating.value,
            UpdatedBy: this.state.feedbackform.email.value
        };
        //AppFeedbackActions.submitUserFeedback(userfeedback);
        this.setState({ loading: true, error: false });
        FeedbackApi.submitUserFeedback(userfeedback)
            .then((response) => {
                //debugger;
                const responseData = response.body;
                if (response.status != 200)
                    this.setState({ error: true, loading: false });
                else if (!responseData || responseData == null) {
                    //console.log('User not found');
                    this.setState({ error: true, loading: false });
                }
                else
                    this.setState({ loading: false, success: true });
            }).catch((err) => {
                console.log(err);
                this.setState({ loading: false, error: true });
            });
    }

    closeModal = () => {
        const updatedSignupForm = {
            ...this.state.feedbackform
        };
        updatedSignupForm.firstname.value = '';
        updatedSignupForm.lastname.value = '';
        updatedSignupForm.email.value = '';
        updatedSignupForm.feedbacktype.value = '';
        updatedSignupForm.feedback.value = '';
        updatedSignupForm.rating.value = '';
        this.setState({ success: false, feedbackform: updatedSignupForm });
    }

    componentDidMount() {

    }
    render() {
        const formElementsArray = [];
        for (let key in this.state.feedbackform) {
            formElementsArray.push({
                id: key,
                config: this.state.feedbackform[key]
            });
        }
        let form = (
            <form className="col-xs-10 col-sm-10 col-md-10">
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
                {/*  */}
                <button className="btn btn-success clickable" type="button" onClick={this.feedbackHandler} disabled={!this.state.formIsValid}>Submit</button>
            </form>
        );

        return (
            <div className="container ContactData">
                <div className="row" style={{paddingLeft:'15px',marginBottom:'20px'}}>
                    <div className="col-xs-12 col-md-12 col-sm-12">
                        <label className="h2">Feedback</label>
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
                    </div>
                </div>
                <Spinner show={this.state.loading && !this.state.error} type='saving' >
                </Spinner>
                <BootStrapModal showModal={this.state.success} titleText="12PM Lunch" modalClassName="alertModal"
                    confirmHandler={this.closeModal} confirmButtonText="Ok">
                    <label>Your feedback submitted successfully.</label>
                </BootStrapModal>
            </div>
        )

    }
}
export default feedback;