import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Overlay, Popover } from 'react-bootstrap';
import { Link, Redirect, Router, withRouter } from 'react-router-dom'
import MenuApi from '../../api/MenuApi';
import common from '../../common/common';
import ErrorComponent from '../../components/common/ErrorComponent/ErrorComponent';
import Spinner from '../../components/common/Spinner/Spinner'
import { relative } from 'path';
import './home.css';
import AppMenuStore from '../../stores/AppMenuStore';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuList: AppMenuStore.getTopMenuList(),
      menuDescription: '',
      showMore: false,
      target: null,
      popoverContainer: '',
      orderingDisabled: false,
      loading: false,
      error: false,
      shutDown: false
    };
  }

  componentWillMount() {
    this.props.headerBanner(true);
  }

  componentWillUnmount() {
    AppMenuStore.removeChangeListener(this._onLoad);
  }

  componentDidMount() {
    AppMenuStore.addChangeListener(this._onLoad);
  }

  _onLoad = () => {
    this.setState({ menuList: AppMenuStore.getTopMenuList() });
  }

  showMoreDetails = (e, comments, index) => {
    this.setState({ target: e.target, popoverContainer: 'divMenu_' + index });
    this.setState({ showMore: !this.state.showMore, menuDescription: comments, loading: false });
  };

  goToOrder(e, menuId) {
    let url = '/Order/' + menuId;
    this.props.history.push(url);
  }

  render() {
    var createRow = function (row, index) {
      return (
        row.ItemType === "1" && (
          <tr key={index}>
            <td className="menuItems">
              {row.Item.ItemName}
            </td>
          </tr>)
      );
    };

    return (
      <div className="row">
        <div className="col-xs-12 col-md-12 col-sm-12">
          <div className="row menuBox">
            <div className="col-xs-12 col-md-12 col-sm-12">
              <label>UPCOMING MENUS</label>
            </div>
          </div>
          <div className="row menuDetails" id="divMenu">
            <table>
              <tbody>
                <tr>
                  <td>
                    {
                      this.state.shutDown === false ? this.state.menuList.map((menu, index) => {
                        return (
                          <div key={index} className="col-xs-2 col-md-2 col-sm-2 img-holder" style={{ position: 'relative', height: 300 }} ref={"divMenu_" + index}>
                            {(menu.ImageUrl == null || menu.ImageUrl == '') && <img src={require('../../menuImages/noimage.jpg')} className="menuImage img-fluid img-rounded" />}
                            {menu.ImageUrl != null && menu.ImageUrl != '' && <img src={require('../../menuImages/' + menu.ImageUrl)} className="menuImage img-fluid img-rounded" />}
                            <br />
                            <label>{new Date(menu.MenuDate).toDateString()}</label>
                            <br />
                            <label className="menuName">{menu.MenuName}</label>
                            <br />
                            <label className="bold text-danger">{'$' + menu.Price.toFixed(2)}</label><br />
                            {/* <span className="textOverflow" titile={menu.MenuItemsStr}>{menu.MenuItemsStr.substring(0, 100)}</span> */}
                            <Link className="viewMore clickable" to='#' onClick={(e) => this.showMoreDetails(e, menu.Comments, index)} title="Click here to view more details of the menu">View More..</Link>
                            <br /><br />
                            < Link className="btn orderButton clickable" style={{ position: 'absolute', bottom: '0px' }} to={'/order/' + menu.MenuId} >ORDER NOW
                            </Link>
                          </div>
                        )
                      }) : (<div className="col-xs-12 col-md-12 col-sm-12 h2" >Menu will be updated soon....</div>)
                    }

                  </td>
                </tr>
                <Overlay
                  show={this.state.showMore}
                  target={this.state.target}
                  placement="top"
                  container={() => ReactDOM.findDOMNode(this.refs[this.state.popoverContainer])}
                  rootClose={true}
                  onHide={() => this.setState({ showMore: false })}>
                  <Popover id="popover-contained" title="Menu Details">
                    <p className="labelTextNormal">{this.state.menuDescription}</p>
                  </Popover>
                </Overlay>
              </tbody>
            </table>
          </div>
          <ErrorComponent show={this.state.orderingDisabled}>
            THANKS FOR CHECKING OUT. WE HAVE NOT YET STARTED TAKING ORDERS YET. PLEASE COME BACK IN 2 DAYS!!!!
                </ErrorComponent>
          <ErrorComponent show={this.state.error} />
          <Spinner show={this.state.loading && !this.state.error} />
        </div>
      </div>
    );
  }
}
export default withRouter(Home);