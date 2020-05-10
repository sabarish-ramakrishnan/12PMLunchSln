import React, { Component } from 'react';

class HowItWorks extends Component {

    componentWillMount() {
        this.props.headerBanner(false);
    }

    render() {
        return (
            <div className="container ContactData">
                <div className="row" style={{ marginBottom: '10px' }}>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <label className="h2">How It Works</label>
                    </div>
                </div>
                <div className="row" style={{ marginTop: '10px' }}>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <label className="form-label">REGISTRATION</label>
                        <ul style={{ marginTop: '5px' }}>
                            <li>Sign up with minimum information like your Name, Email id and phone number.</li>
                            <li>You will receive an email to verify your email id.</li>
                            <li>Confirm your email id and now you are ready to order with us.</li>
                        </ul>
                    </div>
                </div>
                <div className="row" style={{ marginTop: '10px' }}>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <label className="form-label">ORDERING</label>
                        <ul style={{ marginTop: '5px' }}>
                            <li>We take orders for <strong>Monday-Friday</strong>.</li>
                            <li>Menu for next five days will be updated on Home page.</li>
                            <li><strong>Order before 9 PM for next day</strong> lunch, or schedule ahead for the week.</li>
                            <li>Items marked as <strong>Add-On</strong> comes with no additional cost.(1 add-on per each lunch box).</li>
                            <li>Items marked <strong>Special</strong> comes with price as mentioned on the Order page.</li>
                        </ul>
                    </div>
                </div>
                <div className="row" style={{ marginTop: '10px' }}>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <label className="form-label">PAYMENT OPTION</label>
                        <p>At present, we accept <strong>ONLY CASH</strong>. We are working on making this digital.</p>
                    </div>
                </div>
                <div className="row" style={{ marginTop: '10px' }}>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <label className="form-label">FREE DELIVERY/PICKUP</label>
                        <p>Your lunch will be ready at 7 AM. We will deliver your lunch at your doorstep(free delivery) or you can pick it up near Park Tower Market.</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default HowItWorks;