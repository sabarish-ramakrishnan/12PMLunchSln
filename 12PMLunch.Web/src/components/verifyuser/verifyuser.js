import React, { Component } from 'react';
import UserApi from '../../api/UserApi';
import ErrorComponent from '../common/ErrorComponent/ErrorComponent';
import Aux1 from '../common/hoc/Aux1/Aux1';
import Spinner from '../../components/common/Spinner/Spinner'
import { Link, withRouter } from 'react-router-dom'

class VerifyUser extends Component {
    state = {
        userdetails: {},
        loading: true,
        error: false,
        success: true
    }
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        this.props.headerBanner(false);
    }
    componentDidMount() {
        const encodedUserName = this.props.match.params.emailId;
        const encodedToken = this.props.match.params.regToken;
        let user = {
            EncodedRegToken: encodedToken,
            EmailId: encodedUserName
        };
        UserApi.verifyUser(user)
            .then((response) => {
                let responseData = response.body;
                if (response.status != 200)
                    this.setState({ error: true, loading: false });
                else if (!responseData || responseData == null) {
                    this.setState({ error: true, loading: false });
                }
                else
                    this.setState({ loading: false, userdetails: responseData });
            }).catch((err) => {
                console.log(err);
                this.setState({ error: true, loading: false });
            });
    }

    render() {
        let pageContent = null;
        if (this.state.userdetails && this.state.userdetails.EmailVerified === "true")
            pageContent = <Aux1><h2>You have successfully verified your email.</h2><br />
                <p><Link to='/login' className="clickable">Click here</Link> continue to login to website to place the order.</p>
            </Aux1>


        return (
            <div className="container ContactData">
                <div className="row">
                    <div className="col-xs-12 col-md-12 col-sm-12">
                        {pageContent}
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-md-12 col-sm-12">
                        <ErrorComponent show={this.state.error} />
                    </div>
                </div>
                <Spinner show={this.state.loading && !this.state.error} type='custom' >
                    Please wait. You are almost there..
                </Spinner>
            </div>
        )
    }
}



export default withRouter(VerifyUser);