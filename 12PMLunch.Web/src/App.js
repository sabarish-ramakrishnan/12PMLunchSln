import React, { Component } from 'react'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import { Carousel } from 'react-bootstrap';
import Footer from './components/common/footer/Footer'
import Home from './components/home/Home'
import Order from './components/order/Order';
import Feedback from './components/feedback/feedback'
import ContactUs from './components/contactus/ContactUs'
import Signup from './components/signup/signup'
import Login from './components/login/login'
import OrderList from './components/orderlist/OrderList';
import VerifyUser from './components/verifyuser/verifyuser';
import Logout from './components/logout/logout';
import Userprofile from './components/userprofile/userprofile'
import Notifications from 'react-notify-toast';
import Aux1 from './components/common/hoc/Aux1/Aux1'
import common from './common/common';
import HowItWorks from './components/howitworks/howitworks'
import './App.css';
import ChangePassword from './components/changepassword/changepassword';
import Forgotpassword from './components/forgotpassword/forgotpassword';
import Passwordreset from './components/passwordreset/passwordreset';
import Survey from './components/survey/survey'
import Addeditmenu from './components/addeditmenu/addeditmenu';
//import jQuery from 'jquery'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayBanner: true
    }
  }

  setBanner = (displaFlag) => {
    this.setState({ displayBanner: displaFlag })
  }
  render() {
    const carouselInstance = (
      <Carousel>
        <Carousel.Item>
          <img style={{ height: 300, width: 1170 }} alt="900x500" src={require('./img/carousel/lunch3.jpg')} />
          <Carousel.Caption>
            <h3>Food that surprises you each day</h3>
            <p>We promise that you will get never get bored eating our food!</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img style={{ height: 300, width: 1170 }} alt="900x500" src={require('./img/carousel/lunch2.jpg')} />
          <Carousel.Caption>
            <h3>Skip the line</h3>
            <p>Your food is at your doorstep!</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img style={{ height: 300, width: 1170 }} alt="900x500" src={require('./img/carousel/lunch1.jpg')} />
          <Carousel.Caption>
            <h3>Its easy to setup</h3>
            <p>Just give us few details and your are ready to go.</p>
            {/* <button
                      class="btn btn-success" onClick={this.goToSignup}>Click Here</button> */}
            <Link to='/signup' className="btn btn-success">Click Here</Link>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img style={{ height: 300, width: 1170 }} alt="900x500" src={require('./img/carousel/vegcurry.jpg')} />
          <Carousel.Caption>
            <h3>Tell us what you think</h3>
            <p>Go the feedback page and enter your comments!</p>
            {/* <button
                      class="btn btn-success" onClick={this.goToFeedback}>Ask</button> */}
            <Link to='/feedback' className="btn btn-success">Click Here</Link>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img style={{ height: 300, width: 1170 }} alt="900x500" src={require('./img/carousel/biriyani.jpg')} />
          <Carousel.Caption>
            <h3>Meet our chefs</h3>
            <p>Liked our food? Ask our chefs how it is made.</p>
            {/* <button
                      class="btn btn-success" onClick={this.goToFeedback}>Ask</button> 
                      <Link to='/feedback' className="btn btn-success">Click Here</Link>*/}
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    );
    let navBarContentHtml = null;
    let IsAdminUser = common.IsUserAdmin();
    if (!common.isAuthenticated()) {
      navBarContentHtml = <div className="collapse navbar-collapse" id="bs-navbar-collapse-1">
        <ul className="nav navbar-nav">

          <li>
            <Link to="/" className="clickable">Home</Link>
          </li>
          {/* <li className="divider-vertical"></li> */}
          <li>
            <Link to="/order/0" className="clickable">Quick Order</Link>
          </li>
          {/* <li className="divider-vertical"></li> */}
          <li>
            <Link to="/feedback" className="clickable">Feedback</Link>
          </li>
          {/* <li className="divider-vertical"></li> */}
          <li>
            <Link to="contact" className="clickable">Contact Us</Link>
          </li>
          {/* <li className="divider-vertical"></li> */}
          <li>
            <Link to="/HowItWorks" className="clickable"> How It Works</Link>
          </li>
          {/* <li>
            <Link to="/addeditmenu" className="clickable">addeditmenu</Link>
          </li> */}
        </ul>
        <ul className="nav navbar-nav navbar-right">
          <li>
            <Link to="/signup" className="clickable">Sign Up</Link>
          </li>
          {/* <li className="divider-vertical"></li> */}
          <li>
            <Link to="/login" className="clickable">Log In</Link>
          </li>
        </ul>
      </div>;
    }
    else {
      navBarContentHtml = <div className="collapse navbar-collapse" id="bs-navbar-collapse-1">
        <ul className="nav navbar-nav">

          <li>
            <Link to="/" className="clickable">Home</Link>
          </li>
          {!IsAdminUser && <Aux1>
            {/* <li className="divider-vertical"></li> */}
            <li>
              <Link to="/order" className="clickable">Quick Order</Link>
            </li></Aux1>}
          {/* <li className="divider-vertical"></li> */}
          <li>
            <Link to="/orders" className="clickable">{common.IsUserAdmin() ? 'All Orders' : 'My Orders'} </Link>
          </li>
          {/* <li className="divider-vertical"></li> */}
          <li>
            <Link to="/feedback" className="clickable">Feedback</Link>
          </li>
          {/* <li className="divider-vertical"></li> */}
          <li>
            <Link to="/contact" className="clickable">Contact Us</Link>
          </li>
          {/* <li className="divider-vertical"></li> */}
          <li>
            <Link to="/HowItWorks" className="clickable">How It Works</Link>
          </li>
          {/* <li>
            <Link to="/addeditmenu" className="clickable">Add Menu</Link>
          </li> */}
        </ul>
        <ul className="nav navbar-nav navbar-right">
          <li className="dropdown">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{common.getcurrentUserEmail()}<span className="caret"></span></a>
            <ul className="dropdown-menu">
              <li>
                <Link to="/myprofile">My Profile</Link>
              </li>
              <li>
                <Link to="/changepassword">Change Password</Link>
              </li>
              <li role="separator" className="divider"></li>
              <li>
                <Link to="/logout">Log Out</Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>;
    }
    return (
      <div className="App">
        <Notifications />

        <div className="container">
          <BrowserRouter>
            <div>
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12">
                  <div className="masthead topsection" >
                    <div className="form-group">
                      <Link to="/" >
                        <img src={require('./img/logo2_transparent.png')} alt='' className="img-fluid logo" />
                      </Link>
                    </div>
                    <nav className="navbar navbar-default rounded mb-3 navbarColorOverride">

                      <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-navbar-collapse-1" aria-expanded="false">
                          <span className="sr-only">Toggle navigation</span>
                          <span className="icon-bar"></span>
                          <span className="icon-bar"></span>
                          <span className="icon-bar"></span>
                        </button>

                      </div>
                      {navBarContentHtml}
                    </nav>
                    {this.state.displayBanner === true &&
                      <div className="carouselStyle">
                        {carouselInstance}
                      </div>
                    }
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12">
                  <Switch  >
                    <Route path="/" exact render={() => <Home headerBanner={this.setBanner} />} />
                    <Route path="/Order/:menuId" render={(props) => <Order headerBanner={this.setBanner} {...props} />} />
                    <Route path="/Order/" render={(props) => <Order headerBanner={this.setBanner} {...props} />} />
                    <Route path="/Feedback" render={() => <Feedback headerBanner={this.setBanner} />} />
                    <Route path="/Contact" render={() => <ContactUs headerBanner={this.setBanner} />} />
                    <Route path="/Signup" render={() => <Signup headerBanner={this.setBanner} />} />
                    <Route path="/login" render={() => <Login headerBanner={this.setBanner} />} />
                    <Route path="/orders" render={() => <OrderList headerBanner={this.setBanner} />} />
                    <Route path="/VerifyUser/:regToken/:emailId" render={(props) => <VerifyUser headerBanner={this.setBanner} {...props} />} />
                    <Route path="/logout" render={() => <Logout headerBanner={this.setBanner} />} />
                    <Route path="/myprofile" render={() => <Userprofile headerBanner={this.setBanner} />} />
                    <Route path="/HowItWorks" render={() => <HowItWorks headerBanner={this.setBanner} />} />
                    <Route path="/changepassword" render={() => <ChangePassword headerBanner={this.setBanner} />} />
                    <Route path="/forgotpassword" render={() => <Forgotpassword headerBanner={this.setBanner} />} />
                    <Route path="/passwordreset/:regToken/:emailId" render={(props) => <Passwordreset headerBanner={this.setBanner} {...props} />} />
                    <Route path="/survey" render={(props) => <Survey headerBanner={this.setBanner} {...props}/>} />
                    <Route path="/addeditmenu" render={(props) => <Addeditmenu headerBanner={this.setBanner} {...props}/>} />
                  </Switch  >
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12">
                <Footer />
                </div>
              </div>
            </div>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}

export default App;