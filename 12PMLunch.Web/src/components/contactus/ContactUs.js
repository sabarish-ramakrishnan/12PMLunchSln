import React, { Component } from 'react';

class ContactUs  extends  Component 
{

    componentWillMount()
    {
        this.props.headerBanner(false);
    }

    render()
    {
        return (
            <div className="container ContactData">
                <div className="row" style={{marginBottom:'20px'}}>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <label className="h2">Contact Us</label>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <label className="form-label">Email : <a href="mailto:12pmlunch@gmail.com">12pmlunch@gmail.com</a>
                            &nbsp;&nbsp;or&nbsp;&nbsp;<a href="mailto:mail@12pmlunch.com">mail@12pmlunch.com</a></label>
                        <br />
                        <label className="form-label">Phone : (872) 203-2812</label>
                    </div>
                </div>
            </div>
        )
    }
}

export default ContactUs;