import React, { Component } from 'react';
import './survey.css';
import Input from '../common/Input/Input';
import AppFeedbackActions from '../../actions/AppFeedbackActions';
import AppUserStore from '../../stores/AppUserStore';
import common from '../../common/common';
import Spinner from '../../components/common/Spinner/Spinner'
import ErrorComponent from '../../components/common/ErrorComponent/ErrorComponent'
import SurveyApi from '../../api/SurveyApi';
import BootStrapModal from '../../components/common/BootstrapModal/BootstrapModal'
import AppConstants from '../../constants/AppConstants';
import { withRouter } from 'react-router-dom';
import Aux1 from '../common/hoc/Aux1/Aux1';
import { Redirect } from 'react-router-dom';
import NumericInput from 'react-numeric-input';

class survey extends Component {
    // constructor(props) {
    //     super(props);
    // }
    // componentWillMount() {

    // }
    state = {
        mealopted: '',
        comments: '',
        apartment: '',
        username: '',
        mobile: '',
        surveyuniqueid: 'u1',
        option1: '',
        option2: '',
        option3: '',
        surveyform: {
            mealtype: {
                elementtype: 'radio',
                valid: false,
                touched: false,
                errorMessages: [],
                elementClass: 'form-control',
                elementconfig: {
                    options: [
                        { value: 'Lunch', displayValue: 'Lunch' },
                        { value: 'Dinner', displayValue: 'Dinner' },
                        { value: 'Lunch & Dinner', displayValue: 'Lunch & Dinner' },
                        { value: 'Only Curries', displayValue: 'Only Curries' },
                        { value: 'Homemade items', displayValue: 'Homemade items like chapati, dosa/idli batter, pickle, snacks etc' },
                        { value: 'All of the above', displayValue: 'All of the above' },
                    ]
                },
                validation: {
                    required: {
                        message: 'Please answer this question'
                    }
                },
                value: '',
                label: 'What type of meal you prefer from us?',
                uniqueid: 'mealtype',
                commentsEnabled: true,
                comments: ''
            },
            deliverytype: {
                elementtype: 'radio',
                valid: false,
                touched: false,
                errorMessages: [],
                elementClass: 'form-control',
                elementconfig: {
                    options: [
                        { value: 'Pick Up from Park Tower', displayValue: 'Pick Up from Park Tower' },
                        { value: 'Delivered to office', displayValue: 'Delivered to office' },
                        { value: 'Doesnt matter', displayValue: 'Doesnt matter' },
                        { value: 'Prepare lunch yourself', displayValue: 'Prepare lunch yourself' }
                    ]
                },
                validation: {
                    required: {
                        message: 'Please answer this question'
                    }
                },
                value: '',
                label: 'Do you like to pick up your lunch from Park Tower building or delivered to your office?',
                uniqueid: 'deliverytype',
                commentsEnabled: true,
                comments: ''
            },
            cuisine: {
                elementtype: 'radio',
                valid: false,
                touched: false,
                errorMessages: [],
                elementClass: 'form-control',
                elementconfig: {
                    options: [
                        { value: 'North Indian', displayValue: 'North Indian' },
                        { value: 'South indian', displayValue: 'South indian' },
                        { value: 'Doesnt matter', displayValue: 'Doesnt matter' }
                    ]
                },
                validation: {
                    required: {
                        message: 'Please answer this question'
                    }
                },
                value: '',
                label: 'Which type of cuisine you prefer?',
                uniqueid: 'cuisine',
                commentsEnabled: true,
                comments: ''
            },
            spicelevel: {
                elementtype: 'radio',
                valid: false,
                touched: false,
                errorMessages: [],
                elementClass: 'form-control',
                elementconfig: {
                    options: [
                        { value: 'No spice', displayValue: 'No spice' },
                        { value: 'Mild', displayValue: 'Mild' },
                        { value: 'Medium', displayValue: 'Medium' },
                        { value: 'Hot', displayValue: 'Hot' },
                        { value: 'Extra Hot', displayValue: 'Extra Hot' },
                        { value: 'Doesnt matter', displayValue: 'Doesnt matter' }
                    ]
                },
                validation: {
                    required: {
                        message: 'Please answer this question'
                    }
                },
                value: '',
                label: 'Which type of cuisine you prefer?',
                uniqueid: 'spicelevel',
                commentsEnabled: true,
                comments: ''
            },
            ricetype: {
                elementtype: 'radio',
                valid: false,
                touched: false,
                errorMessages: [],
                elementClass: 'form-control',
                elementconfig: {
                    options: [
                        { value: 'White Rice(Sona masoori)', displayValue: 'White Rice(Sona masoori)' },
                        { value: 'Parboiled (Brown rice)', displayValue: 'Parboiled (Brown rice)' },
                        { value: 'Basmati Rice', displayValue: 'Basmati Rice' },
                        { value: 'I prefer chapathi/roti.(dont prefer rice daily)', displayValue: 'I prefer chapathi/roti.(dont prefer rice daily)' },
                        { value: 'Doesnt matter', displayValue: 'Doesnt matter' }
                    ]
                },
                validation: {
                    required: {
                        message: 'Please answer this question'
                    }
                },
                value: '',
                label: 'What kind of rice you prefer for meal?',
                uniqueid: 'ricetype',
                commentsEnabled: true,
                comments: ''
            },
            oiltype: {
                elementtype: 'radio',
                valid: false,
                touched: false,
                errorMessages: [],
                elementClass: 'form-control',
                elementconfig: {
                    options: [
                        { value: 'Canola oil', displayValue: 'Canola oil' },
                        { value: 'Vegetable oil', displayValue: 'Vegetable oil' },
                        { value: 'Cooking olive oil', displayValue: 'Cooking olive oil' },
                        { value: 'Coconut oil', displayValue: 'Coconut oil' },
                        { value: 'Mustard oil', displayValue: 'Mustard oil' },
                        { value: 'Doesnt matter', displayValue: 'Doesnt matter' }
                    ]
                },
                validation: {
                    required: {
                        message: 'Please answer this question'
                    }
                },
                value: '',
                label: 'Which cooking oil you prefer?',
                uniqueid: 'oiltype',
                commentsEnabled: true,
                comments: ''
            },
            vegnonveg: {
                elementtype: 'radio',
                valid: false,
                touched: false,
                errorMessages: [],
                elementClass: 'form-control',
                elementconfig: {
                    options: [
                        { value: 'Vegetarian', displayValue: 'Vegetarian' },
                        { value: 'Eggetarian', displayValue: 'Eggetarian' },
                        { value: 'Fishetarian', displayValue: 'Fishetarian' },
                        { value: 'Chicketarian', displayValue: 'Chicketarian' },
                        { value: 'All of non-veg above', displayValue: 'All of non-veg above' }
                    ]
                },
                validation: {
                    required: {
                        message: 'Please answer this question'
                    }
                },
                value: '',
                label: 'Are you vegetarian or non-vegetarian. (Please provide in comments like how many days in a week you prefer non-veg or if you have any specific preference)',
                uniqueid: 'vegnonveg',
                commentsEnabled: true,
                comments: ''
            },
            budget: {
                elementtype: 'radio',
                valid: false,
                touched: false,
                errorMessages: [],
                elementClass: 'form-control',
                elementconfig: {
                    options: [
                        { value: '$5-6', displayValue: '$5-6' },
                        { value: '$6-7', displayValue: '$6-7' },
                        { value: '$7-8', displayValue: '$7-8' },
                        { value: 'Doesnt matter', displayValue: 'Doesnt matter' }
                    ]
                },
                validation: {
                    required: {
                        message: 'Please answer this question'
                    }
                },
                value: '',
                label: 'What is your budget for a meal?',
                uniqueid: 'budget',
                commentsEnabled: true,
                comments: ''
            },
            weekend: {
                elementtype: 'radio',
                valid: false,
                touched: false,
                errorMessages: [],
                elementClass: 'form-control',
                elementconfig: {
                    options: [
                        { value: 'Yes, regular meals', displayValue: 'Yes, regular meals' },
                        { value: 'Yes, bulk order', displayValue: 'Yes, bulk order' },
                        { value: 'Yes, order a specific dish', displayValue: 'Yes, order a specific dish' },
                        { value: 'Not interested', displayValue: 'Not interested' }
                    ]
                },
                validation: {
                    required: {
                        message: 'Please answer this question'
                    }
                },
                value: '',
                label: 'Would you be interested to order on weekends from us?',
                uniqueid: 'weekend',
                commentsEnabled: true,
                comments: ''
            },
            fryorcurry: {
                elementtype: 'radio',
                valid: false,
                touched: false,
                errorMessages: [],
                elementClass: 'form-control',
                elementconfig: {
                    options: [
                        { value: 'Curry', displayValue: 'Curry' },
                        { value: 'Fry', displayValue: 'Fry' },
                        { value: 'Does not matter', displayValue: 'Does not matter' },
                        { value: 'I am a vegetarian', displayValue: 'I am a vegetarian' }
                    ]
                },
                validation: {
                    required: {
                        message: 'Please answer this question'
                    }
                },
                value: '',
                label: 'Would you prefer to eat non veg as fry or curry?',
                uniqueid: 'fryorcurry',
                commentsEnabled: true,
                comments: ''
            }
        },
        loading: false,
        error: false,
        userAlreadyExists: false,
        MaxedOutPopup: false,
        LoginPopup: false
    }

    inputChangedHandler = (event, inputIdentifier) => {
        //debugger;
        const updatedsurveyform = {
            ...this.state.surveyform
        };
        const updatedFormElement = {
            ...updatedsurveyform[inputIdentifier]
        };

        updatedFormElement.value = event.target.value;
        updatedFormElement.touched = true;

        let validationResult = null;
        if (updatedFormElement.validation) {
            validationResult = common.checkValidity(updatedFormElement, updatedsurveyform);
            updatedFormElement.valid = validationResult.valid;
            updatedFormElement.errorMessages = validationResult.errorMessages;
        }

        //updatedFormElement.valid = this.checkValidity(updatedFormElement.inputIdentifier, updatedFormElement.value, updatedFormElement.validation);

        updatedsurveyform[inputIdentifier] = updatedFormElement;

        let formIsValid = true;
        for (let inputIdentifier in updatedsurveyform) {
            formIsValid = updatedsurveyform[inputIdentifier].valid && formIsValid;
        }
        this.setState({ surveyform: updatedsurveyform, formIsValid: formIsValid });
        //console.log(this.state);
    }

    textareaChangedHandler = (event, inputIdentifier) => {
        //debugger;
        const updatedsurveyform = {
            ...this.state.surveyform
        };
        const updatedFormElement = {
            ...updatedsurveyform[inputIdentifier]
        };

        updatedFormElement.comments = event.target.value;
        updatedsurveyform[inputIdentifier] = updatedFormElement;

        this.setState({ surveyform: updatedsurveyform });
        //console.log(this.state);
    }
    changeHandler = (event) => {
        debugger;
        let val = event.target.value;
        if (event.target.id == "txtApartment") {
            if (event.charCode >= 48 && event.charCode <= 57) {
                this.setState({ apartment: event.target.value });
            }
            else
                event.preventDefault();
        }
        else if (event.target.id == "option1" || event.target.id == "option2" || event.target.id == "option3") {
            this.setState({ mealopted: event.target.value });
        }
    }
    aprtmentchangeHandler = (val) => {
        this.setState({ apartment: val });
    }
    surveyHandler = () => {
        //debugger;
        let usersurvey = {
            SurveyUniqueId: this.state.surveyuniqueid,
            UserId: common.getTokenValue(AppConstants.USER_ID),
            EmailId: common.getcurrentUserEmail(),
            UserName: this.state.username,
            Phone: this.state.mobile,
            Apartment: this.state.apartment,
            MealOpted: this.state.mealopted,
            Comments: this.state.commentsEnabled,
            SurveyQuestionResponses: []
        };
        for (let key in this.state.surveyform) {
            usersurvey.SurveyQuestionResponses.push({
                QuestionUniqueId: this.state.surveyform[key].uniqueid,
                Question: this.state.surveyform[key].label,
                Response: this.state.surveyform[key].value,
                Comments: this.state.surveyform[key].comments
            });
        }
        //console.log(usersurvey);
        this.setState({ loading: true, error: false });
        SurveyApi.submitUsersurvey(usersurvey)
            .then((response) => {
                debugger;
                const responseData = response.body;
                if (response.status != 200)
                    this.setState({ error: true, loading: false });
                else if (!responseData || responseData == null) {
                    //console.log('User not found');
                    this.setState({ error: true, loading: false });
                }
                else if (responseData.UserExists == true) {
                    this.setState({ loading: false, userAlreadyExists: true });
                }
                else if (responseData.MaxedOut == true) {
                    this.setState({ loading: false, MaxedOutPopup: true });
                }
                else
                    this.setState({ loading: false, success: true });
            }).catch((err) => {
                console.log(err);
                this.setState({ loading: false, error: true });
            });
    }

    closeModal = () => {
        this.setState({ success: false });
        this.props.history.push('/');
    }
    componentWillMount = () => {
        //debugger;
        this.props.headerBanner(false);
        if (!common.isAuthenticated()) {
            this.setState({ LoginPopup: true });
        }
        //this.props.history.push('/login');
    }
    componentDidMount = () => {
        if (common.isAuthenticated()) {
            //     this.props.history.push('/login');

            // }
            // else {
            let reqObject = {
                UserId: common.getTokenValue(AppConstants.USER_ID)
            };
            this.setState({ loading: true, error: false });
            SurveyApi.getSurveyInfo(reqObject)
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
                        this.setState({
                            loading: false,
                            mobile: responseData.Phone,
                            username: responseData.FullName,
                            option1: responseData.Option1,
                            option2: responseData.Option2,
                            option3: responseData.Option3
                        });
                }).catch((err) => {
                    console.log(err);
                    this.setState({ loading: false, error: true });
                });
        }
    }
    render() {
        { !common.isAuthenticated() && <Redirect to='/' /> }
        const formElementsArray = [];
        for (let key in this.state.surveyform) {
            formElementsArray.push({
                id: key,
                config: this.state.surveyform[key]
            });
        }
        let form = (
            <form className="col-xs-10 col-sm-10 col-md-10">
                {
                    formElementsArray.map(formElement => (
                        <div className="form-group" key={formElement.id} style={{ paddingTop: '25px' }}>
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
                            >{formElement.config.label}</Input>
                            {formElement.config.commentsEnabled &&
                                <textarea className="form-control" rows="3"
                                    onChange={(event) => this.textareaChangedHandler(event, formElement.id)}></textarea>}
                        </div>
                    ))
                }
                {(this.state.option1 || this.state.option3 || this.state.option2) && <Aux1>
                    <div className="row" style={{ marginLeft: '10px' }}>
                        <label className="form-label">Please choose your complementary meal from below options</label>
                    </div>
                    <div className="row">

                        {this.state.option1 && <div className="col-xs-2 col-md-2 col-sm-2 img-holder">
                            <div className='radio'>
                                <label>
                                    <input type='radio' value='CHICKEN BIRIYANI' name='complemntary' id='option1' onChange={this.changeHandler} />
                                    <img src={require('../../menuImages/02072018.jpg')} className="menuImage img-fluid img-rounded" />
                                    <br />
                                    CHICKEN BIRIYANI
                            </label>
                            </div>
                        </div>}
                        {this.state.option2 && <div className="col-xs-2 col-md-2 col-sm-2 img-holder" style={{ marginLeft: '20px' }}>
                            <div className='radio'>
                                <label>
                                    <input type='radio' value='VEG PULAV' name='complemntary' id='option2' onChange={this.changeHandler} />
                                    <img src={require('../../menuImages/VEG_PULAV.jpg')} className="menuImage img-fluid img-rounded" />
                                    <br />
                                    VEG PULAV
                            </label>
                            </div>
                        </div>}
                        {this.state.option3 && <div className="col-xs-4 col-md-4 col-sm-4 img-holder" style={{ marginLeft: '20px' }}>
                            <div className='radio'>
                                <label>
                                    <input type='radio' value='VEG KOTHU PARATHA' name='complemntary' id='option3' onChange={this.changeHandler} />
                                    <img src={require('../../menuImages/02122018.jpg')} className="menuImage img-fluid img-rounded" />
                                    <br />
                                    VEG KOTHU PARATHA
                            </label>
                            </div>
                        </div>}
                    </div>
                </Aux1>}
                {<ErrorComponent show={(!this.state.option1 && !this.state.option3 && !this.state.option2)}>
                    Sorry, our complementary meals is maxed out. You can still submit your survey.
                </ErrorComponent>}
                {/*  */}
                <br />
                <button className="btn btn-success clickable" type="button" onClick={this.surveyHandler} disabled={!this.state.formIsValid}
                    title={!this.state.formIsValid ? 'Please answer all the questions. Button will be enabled once you complete all the questions' : 'Submit'}
                >Submit</button>
            </form>
        );

        return (

            <div className="container ContactData">
                <div className="row" style={{ paddingLeft: '15px', marginBottom: '20px' }}>
                    <div className="col-xs-12 col-md-12 col-sm-12">
                        <label className="h2">Survey</label>
                        <span className='small' style={{ marginLeft: '20px', color: 'Red' }}>All questions are mandatory.</span>
                    </div>
                </div>
                <div className="row" style={{ paddingLeft: '15px' }}>
                    <div className="col-md-12 col-lg-12 col-sm-12">
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <div className="">
                                <label className="form-label">{common.getcurrentUserEmail()}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row" style={{ paddingLeft: '15px' }}>
                    <div className="col-md-12 col-lg-12 col-sm-12">
                        <div className="form-group">
                            <label className="form-label">Building</label>
                            <div className="">
                                <input type="text" className="" disabled={true} value='5415 N Sheridan Rd'></input>
                                <br />
                                {/* <input type="text" className="" id="txtApartment" onKeyPress={this.changeHandler}></input> */}
                                <label className="form-label">Apartment #</label><NumericInput min={100} max={5600} className="form-control" onChange={this.aprtmentchangeHandler} />
                            </div>
                        </div>
                        <p className='small text-danger'>Your apartment info will be used to deliver the food. So please make sure you enter apartment number correctly.</p>
                    </div>
                </div>

                <div className="row">
                    <div className="col-xs-12 col-md-9 col-sm-12">
                        {form}
                    </div>
                </div>
                <div className="row" style={{ paddingLeft: '15px', paddingTop: '10px' }}>
                    <div className="col-xs-12 col-md-12 col-sm-12">
                        <ErrorComponent show={this.state.error} />
                    </div>
                </div>
                <Spinner show={this.state.loading && !this.state.error} type='waiting' >
                </Spinner>
                <BootStrapModal showModal={this.state.success} titleText="12PM Lunch" modalClassName="alertModal"
                    confirmHandler={this.closeModal} confirmButtonText="Ok">
                    <label>Thank you for completing the survey. A confirmation email is sent to you. Please check your email for further instructions</label>
                </BootStrapModal>
                <BootStrapModal showModal={this.state.userAlreadyExists} titleText="12PM Lunch" modalClassName="alertModal"
                    confirmHandler={this.closeModal} confirmButtonText="Ok">
                    <label>You have already completed the survey. Thanks for submitting again.</label>
                </BootStrapModal>
                <BootStrapModal showModal={this.state.MaxedOutPopup} titleText="12PM Lunch" modalClassName="alertModal"
                    confirmHandler={this.closeModal} confirmButtonText="Ok">
                    <label>Thank you for completing the survey</label>
                </BootStrapModal>
                <BootStrapModal showModal={this.state.LoginPopup} titleText="12PM Lunch" modalClassName="alertModal"
                    confirmHandler={() => this.props.history.push('/login')} confirmButtonText="Ok">
                    <label>Please login to complete the survey</label>
                </BootStrapModal>
            </div>
        )

    }
}
export default withRouter(survey);