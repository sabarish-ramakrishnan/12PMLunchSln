import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Overlay, Popover, Carousel } from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import { Link } from 'react-router-dom'
import OrderApi from '../../api/OrderApi';
import './Order.css';
import common from '../../common/common';
import Spinner from '../../components/common/Spinner/Spinner';
import ErrorComponent from '../../components/common/ErrorComponent/ErrorComponent';
import Aux1 from '../common/hoc/Aux1/Aux1';
import AppOrderActions from '../../actions/AppOrderActions';
import AppOrderStore from '../../stores/AppOrderStore';
import AppMenuStore from '../../stores/AppMenuStore';

class Order extends Component {

  constructor(props) {
    super(props);
    this.specialQuantity = 0;
    this.specialPrice = 0;

    let minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);

    this.state = {
      showModal: false,
      validationMessage: '',
      showMore: false,
      menuDescription: '',
      carouselIndex: 0,
      carouselDirection: null,
      datePickerMinValue: minDate,
      order: {
        orderId: null,
        menuDate: common.addDaysTodate(new Date(), 1),
        menuId: this.props.match.params.menuId && this.props.match.params.menuId != null ? this.props.match.params.menuId : 0,
        menuTypeId: null,
        menuTypeDescription: '',
        menuName: '',
        menuPrice: '',
        menuImage: '',
        orderQuantity: 1,
        comments: '',
        menuTypes: [],
        mainItems: [],
        addOnItems: [],
        specialItems: [],
        selectedSpecialItem: { "ItemId": 0, "ItemName": "", quantity: 0, "ItemPrice": 0 },
        selectedAddOnItems: []
      },
      error: false,
      loading: false,
      submitFlag:false,
      OrderId: null
    };
  };

  componentWillMount() {
    this.props.headerBanner(false);
  }

  componentWillUnmount() {
    AppOrderStore.removeChangeListener(this._onSubmit);
  }

  componentDidMount() {
    AppOrderStore.addChangeListener(this._onSubmit);
    if (!common.isAuthenticated()) {
      let url = '/Login';
      this.props.history.push(url);
    }
    else {
      if (this.state.order.menuId !== 0 && this.state.order.menuId !== "0") {
        this.getMenuById();
      }
      else {
        this.getMenuByDate();
      }
    }

  }

  _onSubmit = () => {
    debugger;
    let order = AppOrderStore.getLastOrder();
    this.setState({ OrderId: order.OrderId });

    if (this.state.OrderId > 0 && this.state.submitFlag == true) {
      this.setState({ loading: false, showModal: true, validationMessage: 'Your order has been placed successfully. Confirmation is sent to your email' });
    }
    else if (this.state.OrderId === -1 && this.state.submitFlag == true) {
      this.setState({ loading: false, showModal: true, validationMessage: 'The orders has reached the maximum limit today.' });
    }
    else if (this.state.submitFlag == true) {
      this.setState({ loading: false, error: true });
    }
  }

  handleDateChange = (date) => {
    //console.log('date:' + date);
    let order = this.state.order;
    order["menuDate"] = date;
    this.setState({ order: order });
    this.getMenuByDate();
  }

  getMenuById() {
    //debugger;
    let menuObj = AppMenuStore.getMenuById(this.state.order.menuId);
    if (menuObj !== null && menuObj !== undefined) {
      this.populateMenuType(menuObj);
    }
    else {
      this.props.history.push('/');
    }
  }

  getMenuByDate() {
    //debugger;

    let order = {
      orderId: null,
      menuDate: this.state.order.menuDate,
      menuId: null,
      menuTypeId: null,
      menuTypeDescription: '',
      menuName: '',
      menuPrice: '',
      menuImage: '',
      orderQuantity: 1,
      comments: '',
      menuTypes: [],
      mainItems: [],
      addOnItems: [],
      specialItems: [],
      selectedSpecialItem: { "ItemId": 0, "ItemName": "", quantity: 0, "ItemPrice": 0 },
      selectedAddOnItems: []
    }
    this.setState({ order: order });
    let menuObj = AppMenuStore.getMenuByDate(this.state.order.menuDate);
    if (menuObj !== null && menuObj !== undefined) {
      this.populateMenuType(menuObj);
    }
    else {
      let length = AppMenuStore.getTopMenuListCount();
      if (length > 0) {
        this.setState({loading: false, submitFlag: false, showModal: true, validationMessage: 'No menu available.Please select the available date.' });
      }
      else {
        this.props.history.push('/');
      }
    }
  }

  populateMenuType(data) {
    if (data != null) {
      let mainItems = [];
      let addOnItems = [];
      let specialItems = [];
      let menuTypes = [];
      let order = this.state.order;
      let menuTypelength = data.MenuTypes.length;
     // debugger;
      if (menuTypelength > 0) {

        if (menuTypelength === 1) {
          order.menuTypes = data.MenuTypes;
          order.menuId = data.MenuId;
          order.menuDate = new Date(data.MenuDate);
          this.setState({ order: order, carouselIndex: 1 });

          let menuTypeId = data.MenuTypes[0].MenuTypeId;
          this.SelectMenuType(menuTypeId);
        }
        else {
          order.menuTypes = data.MenuTypes;
          order.menuId = data.MenuId;
          order.menuDate = new Date(data.MenuDate);
          this.setState({ order: order });
        }
      }
    }
  }

  SelectMenuType = (menuTypeId) => {
    let mainItems = [];
    let addOnItems = [];
    let specialItems = [];
    let order = this.state.order;

    let menuType = order.menuTypes.filter(x => parseInt(x.MenuTypeId, 10) === parseInt(menuTypeId, 10))[0];

    if (menuType.MenuItems !== null) {

      mainItems = menuType.MenuItems.filter(x => x.ItemType === "1");
      addOnItems = menuType.MenuItems.filter(x => x.ItemType === "3");
      specialItems = menuType.MenuItems.filter(x => x.ItemType === "2");

      order.menuTypeId = menuType.MenuTypeId;
      order.menuName = menuType.MenuTypeName;
      order.menuTypeDescription = menuType.Description;
      order.menuImage = require('../../menuImages/' + menuType.ImageUrl);
      order.menuPrice = menuType.Price;
      order.mainItems = mainItems;
      order.addOnItems = addOnItems;
      order.specialItems = specialItems;
      order.selectedSpecialItem = { "ItemId": 0, "ItemName": "", quantity: 0, "ItemPrice": 0 },
        order.selectedAddOnItems = []

      if (order.addOnItems.length > 0) {
        order.addOnItems.unshift(
          {
            Item: {
              ItemId: 0,
              ItemName: "--Select--",
              ItemDescription: "--Select--",
              ItemPrice: 0,
              IsActive: true,
              ImageUrl: null
            },
            ItemId: 0,
            ItemPrice: 0,
            ItemType: "3",
            ItemTypeStr: "AddOn Item",
            MenuId: order.menuId,
            MenuItemMappingId: null
          }
        )
        order.selectedAddOnItems.push({ "ItemId": 0, "ItemName": "", quantity: 0 })
      }

      if (order.specialItems.length > 0) {
        order.specialItems.unshift(
          {
            Item: {
              ItemId: 0,
              ItemName: "--Select--",
              ItemDescription: "--Select--",
              ItemPrice: 0,
              IsActive: true,
              ImageUrl: null
            },
            ItemId: 0,
            ItemPrice: 0,
            ItemType: "2",
            ItemTypeStr: "Special Item",
            MenuId: order.menuId,
            MenuItemMappingId: null
          }
        )
      }

      this.setState({ order: order, carouselIndex: 1 });
    }
  }

  GoToMenuType = () => {
    this.setState({ carouselIndex: 0 });
  }

  GoToOrder = () => {
    this.setState({ carouselIndex: 1 });
  }

  GoToReviewOrder = () => {
    if (this.ValidateForm()) {
      this.setState({ carouselIndex: 2 });
    }
  }

  PlaceOrder = () => {
    //debugger;
    
    this.setState({ loading: true, error: false, submitFlag: true });
    AppOrderActions.submitOrder(this.state.order);
  }

  handleModalClose = () => {
    this.setState({ submitFlag: false, showModal: false, validationMessage: '' });
    if (this.state.submitFlag === true) {
      this.props.history.push('/');
    }
  }

  showMoreDetails = (e, description) => {
    this.setState({ target: e.target });
    this.setState({ showMore: !this.state.showMore, menuDescription: description, loading: false });
  };

  handleChange = (event) => {
    let order = this.state.order;
    order[event.target.name] = event.target.value;
    if (event.target.name.trim() === "orderQuantity") {
      let count = order.selectedAddOnItems.length;
      if (count > order.orderQuantity) {
        for (let index = count; index > order.orderQuantity; index--) {
          order.selectedAddOnItems.splice(index - 1, 1);
        }
      }
    }
    this.setState({ order: order });
  };

  handleSpecialItemChange = (event) => {
    let order = this.state.order;
    let item = order.specialItems.filter(x => x.ItemId === parseInt(event.target.value.trim(), 10));
    if (item.length > 0) {
      order.selectedSpecialItem = { "ItemId": parseInt(event.target.value.trim(), 10), 'ItemName': item[0].Item.ItemName, quantity: order.selectedSpecialItem.quantity, "ItemPrice": item[0].ItemPrice };
      this.setState({ order: order });
    }
  };

  handleSpecialQuantityChange = (event) => {
    let order = this.state.order;
    order.selectedSpecialItem = { "ItemId": order.selectedSpecialItem.ItemId, 'ItemName': order.selectedSpecialItem.ItemName, quantity: parseInt(event.target.value.trim(), 10), "ItemPrice": order.selectedSpecialItem.ItemPrice };
    this.setState({ order: order });
    //ref= {node => this.specialItem = node} 
    //this.specialItem.focus();
    //console.log(this.state.order.selectedSpecialItem);
  };


  handleAddOnItemChange = (event, index) => {
    let order = this.state.order;
    let item = order.addOnItems.filter(x => x.ItemId === parseInt(event.target.value.trim(), 10));
    let isItemExist = false;
    for (let i = 0; i < order.selectedAddOnItems.length; i++) {
      if (parseInt(event.target.value.trim(), 10) === order.selectedAddOnItems[i].ItemId && event.target.value.trim() !== "0") {
        isItemExist = true;
        this.setState({ showModal: true, validationMessage: 'Same AddOn item already ordered. Please update the quantity of existing AddOn item' });
        break;
      }
    }

    if (!isItemExist) {
      order.selectedAddOnItems[index] = { "ItemId": parseInt(event.target.value.trim(), 10), "ItemName": item[0].Item.ItemName, quantity: order.selectedAddOnItems[index].quantity };
      this.setState({ order: order });
    }
  };

  handleAddOnQuantityChange = (event, index) => {
    let order = this.state.order;
    order.selectedAddOnItems[index] = { "ItemId": order.selectedAddOnItems[index].ItemId, "ItemName": order.selectedAddOnItems[index].ItemName, quantity: parseInt(event.target.value.trim(), 10) };
    this.setState({ order: order });

    let totalAddOnQty = 0;
    for (let i = 0; i < order.selectedAddOnItems.length; i++) {
      totalAddOnQty = totalAddOnQty + parseInt(order.selectedAddOnItems[i].quantity, 10);
    }

    if (totalAddOnQty > order.orderQuantity) {
      order.selectedAddOnItems[index] = { "ItemId": order.selectedAddOnItems[index].ItemId, "ItemName": order.selectedAddOnItems[index].ItemName, quantity: 0 };
      this.setState({ order: order, showModal: true, validationMessage: 'AddOn items should not be greater than the order quantity' });
    }
  };

  AddRow = () => {
    let order = this.state.order;
    let count = order.selectedAddOnItems.length + 1;
    let totalAddOnQty = 0;
    for (let i = 0; i < order.selectedAddOnItems.length; i++) {
      totalAddOnQty = totalAddOnQty + parseInt(order.selectedAddOnItems[i].quantity, 10);
    }

    if (count <= order.orderQuantity && totalAddOnQty < order.orderQuantity) {
      order.selectedAddOnItems.push({ "ItemId": 0, "ItemName": "", quantity: 0 })
      this.setState({ order: order });
    }
    else {
      this.setState({ showModal: true, validationMessage: 'AddOn items should not be greater than the order quantity' });
    }
  }

  RemmoveRow = (event, index) => {
    let order = this.state.order;
    order.selectedAddOnItems.splice(index, 1);
    this.setState({ order: order });
  }

  ValidateForm = () => {
    let retFlag = true;
    let order = this.state.order;

    if (order.selectedSpecialItem.ItemId === 0 && order.selectedSpecialItem.quantity !== 0) {
      retFlag = false;
      ReactDOM.findDOMNode(this.refs.specialItem).focus();
      this.setState({ showModal: true, validationMessage: 'Please select the special item' });
    }
    else if (order.selectedSpecialItem.ItemId !== 0 && order.selectedSpecialItem.quantity === 0) {
      retFlag = false;
      ReactDOM.findDOMNode(this.refs.specialQuantity).focus();
      this.setState({ showModal: true, validationMessage: 'Please select the special item quantity' });
    }
    else {
      for (let index = 0; index < order.selectedAddOnItems.length; index++) {
        if (order.selectedAddOnItems[index].ItemId === 0 && order.selectedAddOnItems[index].quantity !== 0) {
          retFlag = false;
          ReactDOM.findDOMNode(this.refs["addOnItem_" + index]).focus();
          this.setState({ showModal: true, validationMessage: 'Please select the addOn item' });
          break;
        }
        else if (order.selectedAddOnItems[index].ItemId !== 0 && order.selectedAddOnItems[index].quantity === 0) {
          retFlag = false;
          ReactDOM.findDOMNode(this.refs["addOnQuantity_" + index]).focus();
          this.setState({ showModal: true, validationMessage: 'Please select the addOn quantity' });
          break;
        }

      }
    }
    return retFlag;
  }

  render() {
    return (
      <Aux1>
        <Carousel
          activeIndex={this.state.carouselIndex}
          direction={this.state.carouselDirection}
        >
          <Carousel.Item>
            <div style={{ textAlign: 'left' }}>
              <br />
              <br />
              <div className="row">
                <div className="col-xs-1 col-sm-1 col-md-1">
                </div>
                <div className="col-xs-10 col-sm-10 col-md-10 divBorder" style={{ minHeight: '500px' }} >
                  <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12" style={{ textAlign: 'center' }}>
                      <label className="orderHeader">MENU OPTIONS</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xs-2 ccol-sm-2 col-md-2" style={{ marginLeft: '15px' }}>
                      <label className="labeText">Date</label><br />
                      <div className="clickable" style={{ zIndex: 1000, position: 'relative' }}>
                        <DatePicker id="menuDatepicker" className="clickable" minDate={this.state.datePickerMinValue} value={this.state.order.menuDate} onChange={this.handleDateChange} />
                      </div>
                    </div>
                    <div className="col-xs-10 col-sm-10 col-md-10">
                    </div>
                  </div>
                  <br />
                  {
                    this.state.order.menuTypes.map((menu, index) => {
                      return (
                        <div key={index} className="col-xs-2 col-md-2 col-sm-2 img-holder" style={{ position: 'relative', height: 300 }} >
                          <img src={require('../../menuImages/' + menu.ImageUrl)} className="menuImage img-fluid img-rounded" />
                          <br />
                          <br />
                          <label className="menuName">{menu.MenuTypeName}</label>
                          <br />
                          <label className="bold text-danger">{'$' + menu.Price.toFixed(2)}</label><br />
                          <Link className="viewMore clickable" to='#' onClick={(e) => this.showMoreDetails(e, menu.Description, index)} title="Click here to view more details of the menu">View More..</Link>
                          <br /><br />
                          < Link className="btn orderButton clickable" style={{ position: 'absolute', bottom: '0px' }} to='#' onClick={() => this.SelectMenuType(menu.MenuTypeId)} >SELECT
                            </Link>
                        </div>
                      )
                    })
                  }
                  <br />
                </div>
                <div className="col-xs-1 col-sm-1 col-md-1"></div>
              </div>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div style={{ textAlign: 'left' }}>
              <br />
              <br />
              <div className="row">
                <div className="col-xs-1 col-sm-1 col-md-1">
                </div>
                <div className="col-xs-10 col-sm-10 col-md-10 divBorder" >
                  <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12" style={{ textAlign: 'center' }}>
                    <label className="orderHeader">ENTER ORDER DETAILS</label>
                    </div>
                  </div>
                  <br/>
                  <div className="row">
                    <div className="col-xs-4 col-sm-4 col-md-4 labeText">
                      Item
                    </div>
                    <div className="col-xs-3 col-sm-3 col-md-3 labeText" >
                      Quantity
                    </div>
                    <div className="col-xs-2 col-sm-2 col-md-2 labeText" >
                      Price
                    </div>
                    <div className="col-xs-3 col-sm-3 col-md-3 labeText" >
                      <span >Amount</span>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-xs-4 col-sm-4 col-md-4">
                      <div className="row">
                        <div className="col-xs-8 col-sm-8 col-md-8">
                          <img alt='' src={this.state.order.menuImage} className="img-responsive" />
                        </div>
                        <div className="col-xs-4 col-sm-4 col-md-4">
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-xs-12 col-sm-12 col-md-12">
                          <label className="menuName">{this.state.order.menuName}</label>
                        </div>
                      </div>
                      {
                        this.state.order.mainItems.map((itm, index) => {
                          return (<div key={index} className="row"><div className="col-xs-12 col-sm-12 col-md-12 menuItems"><span title={itm.Item.ItemDescription}>{itm.Item.ItemName}</span></div></div>)
                        })
                      }
                      <div className="row">
                        <div ref="containerCell" className="col-xs-12 col-sm-12 col-md-12">
                          <Link className="viewMore clickable" to='#' title="Click here to view more details of the menu" onClick={e => this.showMoreDetails(e, this.state.order.menuTypeDescription)}>View More..</Link>
                        </div>
                      </div>
                      <Overlay
                        show={this.state.showMore}
                        target={this.state.target}
                        placement="top"
                        container={this}
                        rootClose={true}
                        onHide={() => this.setState({ showMore: false })}
                      >
                        <Popover id="popover-contained" title="Menu Details">
                          <p className="labelTextNormal">{this.state.menuDescription}</p>
                        </Popover>
                      </Overlay>
                    </div>
                    <div valign="top" className="col-xs-3 col-sm-3 col-md-3">
                      <select className="form-control" style={{ width: '70%' }} value={this.state.order.orderQuantity} onChange={this.handleChange} name="orderQuantity">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    </div>
                    <div valign="top" className="col-xs-2 col-sm-2 col-md-2">
                      <label className="labelTextNormal">${this.state.order.menuPrice}</label>
                    </div>
                    <div valign="top" className="col-xs-3 col-sm-3 col-md-3">
                      <label className="labelTextNormal">${this.state.order.menuPrice * this.state.order.orderQuantity}</label>
                    </div>
                  </div>
                  <br />
                  {
                    this.state.order.specialItems.length > 0 &&
                    <div className="row">
                      <div className="col-xs-4 col-sm-4 col-md-4">
                        <label className="labeText">Special</label><br />
                        <select style={{ width: '70%' }} ref="specialItem" className="form-control" value={this.state.order.selectedSpecialItem.ItemId} onChange={this.handleSpecialItemChange} name="specialItem" >
                          {
                            this.state.order.specialItems.map((itm, index) => {
                              return (<option key={index} value={itm.ItemId}>{itm.Item.ItemName}</option>)
                            })
                          }
                        </select>
                      </div>
                      <div valign="top" className="col-xs-3 col-sm-3 col-md-3">
                        <br />
                        <select ref="specialQuantity" style={{ width: '70%' }} className="form-control" value={this.state.order.selectedSpecialItem.quantity} onChange={this.handleSpecialQuantityChange} name="specialQuantity" >
                          <option value="0">None</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                      </div>
                      <div valign="top" className="col-xs-2 col-sm-2 col-md-2"><br />
                        <label className="labelTextNormal">${this.state.order.selectedSpecialItem.ItemPrice}</label>
                      </div>
                      <div valign="top" className="col-xs-3 col-sm-3 col-md-3"><br />
                        <label className="labelTextNormal">${this.state.order.selectedSpecialItem.ItemPrice * this.state.order.selectedSpecialItem.quantity}</label>
                      </div>
                    </div>
                  }
                  <br />
                  {
                    this.state.order.addOnItems.length > 0 &&
                    <div className="row">
                      <div className="col-xs-12 col-sm-12 col-md-12">
                        <label className="labeText">AddOn Item</label>&nbsp;&nbsp;
                          <img onClick={this.AddRow} style={{ marginBottom: '5px', cursor: 'pointer' }} alt='' title='Click here to add more AddOn' src={require('../../img/Add.jpg')} height='30px' width='30px' />
                      </div>
                    </div>
                  }
                  {
                    this.state.order.selectedAddOnItems.map((lst, index) => {
                      return (<div className="row" key={index}>
                        <div valign="top" className="col-xs-4 col-sm-4 col-md-4">
                          <select style={{ width: '70%' }} className="form-control" ref={"addOnItem_" + index} name="addOnItem" value={lst.ItemId} onChange={e => this.handleAddOnItemChange(e, index)}>
                            {
                              this.state.order.addOnItems.map((itm, index) => {
                                return (<option key={index} value={itm.ItemId}>{itm.Item.ItemName}</option>)
                              })
                            }
                          </select>
                        </div>
                        <div valign="top" className="col-xs-3 col-sm-3 col-md-3">
                          <select style={{ width: '70%' }} className="form-control-inline" ref={"addOnQuantity_" + index} name="addOnQuantity" value={lst.quantity} onChange={e => this.handleAddOnQuantityChange(e, index)}>
                            <option value="0">None</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>&nbsp;&nbsp;
                            {
                            index !== 0 &&
                            <img onClick={e => this.RemmoveRow(e, index)} style={{ marginBottom: '5px', cursor: 'pointer' }} alt='' title='Click here to Remove the AddOn' src={require('../../img/Remove.jpg')} height='30px' width='30px' />
                          }
                        </div>
                        <div valign="top" className="col-xs-2 col-sm-2 col-md-2"><br />
                          &nbsp;
                        </div>
                        <div valign="top" className="col-xs-3 col-sm-3 col-md-3"><br />
                          &nbsp;
                        </div>
                      </div>)
                    })
                  }

                  <div className="row">
                    <div className="col-xs-4 col-sm-4 col-md-4">
                    </div>
                    <div valign="top" className="col-xs-3 col-sm-3 col-md-3">
                    </div>
                    <div valign="top" className="col-xs-2 col-sm-2 col-md-2"><br />
                      <label className="labeText">Total</label>
                    </div>
                    <div valign="top" className="col-xs-3 col-sm-3 col-md-3"><br />
                      <label className="labeText">${(this.state.order.menuPrice * this.state.order.orderQuantity) + (this.state.order.selectedSpecialItem.ItemPrice * this.state.order.selectedSpecialItem.quantity)}</label>
                    </div>
                  </div>

                </div>
              </div>
              <div className="col-xs-1 col-sm-1 col-md-1">
              </div>
            </div>
            <br />
            <div className="row" >
              <div className="col-xs-1 col-sm-1 col-md-1">
              </div>
              <div className="col-xs-2 col-sm-2 col-md-2">
                <button type="button" className="btn btn-success clickable" onClick={this.GoToMenuType}> &lt;&lt; Back</button>
              </div>
              <div className="col-xs-3 col-sm-3 col-md-3">
              </div>
              <div className="col-xs2 col-sm-2 col-md-2">
                <button type="button" className="btn btn-success clickable" onClick={this.GoToReviewOrder}>Review Order</button>
              </div>
              <div className="col-xs-4 col-sm-4 col-md-4">
              </div>
            </div>
            <br />
            <br />
            <Modal show={this.state.showModal} onHide={this.handleModalClose}>
              <Modal.Header closeButton>
                <Modal.Title className="labeText">12PM Lunch</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <label className={this.state.submitFlag===false ? 'errorText':'labeText'}>{this.state.validationMessage}</label>
              </Modal.Body>
              <Modal.Footer>
                <Button className="btn btn-success clickable" onClick={this.handleModalClose}>Close</Button>
              </Modal.Footer>
            </Modal>
          </Carousel.Item>
          <Carousel.Item>
            <br />
            <br />
            <div className="row" style={{ textAlign: 'left' }}>
              <div className="col-xs-1 col-sm-1 col-md-1">
              </div>
              <div className="col-xs-10 col-sm-10 col-md-10 divBorder">
                <div className="row">
                  <div className="col-xs-12 col-sm-12 col-md-12" style={{ textAlign: 'center' }}>
                     <label className="orderHeader">REVIEW ORDER</label>
                  </div>
                </div>
                <br/>
                <div className="row">
                  <div className="col-xs-4 col-sm-4 col-md-4 labeText">
                    Item
                        </div>
                  <div className="col-xs-3 col-sm-3 col-md-3 labeText" >
                    Quantity
                        </div>
                  <div className="col-xs-2 col-sm-2 col-md-2 labeText" >
                    Price
                        </div>
                  <div className="col-xs-3 col-sm-3 col-md-3 labeText" >
                    <span >Amount</span>
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-xs-4 col-sm-4 col-md-4">
                    <label className="labelTextNormal">{this.state.order.menuName}</label>
                  </div>
                  <div valign="top" className="col-xs-3 col-sm-3 col-md-3">
                    <label className="labelTextNormal">{this.state.order.orderQuantity}</label>
                  </div>
                  <div valign="top" className="col-xs-2 col-sm-2 col-md-2">
                    <label className="labelTextNormal">${this.state.order.menuPrice}</label>
                  </div>
                  <div valign="top" className="col-xs-3 col-sm-3 col-md-3">
                    <label className="labelTextNormal">${this.state.order.menuPrice * this.state.order.orderQuantity}</label>
                  </div>
                </div>
                <br />
                {
                  this.state.order.selectedSpecialItem.quantity > 0 &&
                  <div className="row">
                    <div className="col-xs-4 col-sm-4 col-md-4">
                      <label className="labeText">Special</label><br />
                      <label className="labelTextNormal">{this.state.order.selectedSpecialItem.ItemName}</label>
                    </div>
                    <div valign="top" className="col-xs-3 col-sm-3 col-md-3">
                      <br />
                      <label className="labelTextNormal">{this.state.order.selectedSpecialItem.quantity}</label>
                    </div>
                    <div valign="top" className="col-xs-2 col-sm-2 col-md-2"><br />
                      <label className="labelTextNormal">${this.state.order.selectedSpecialItem.ItemPrice}</label>
                    </div>
                    <div valign="top" className="col-xs-3 col-sm-3 col-md-3"><br />
                      <label className="labelTextNormal">${this.state.order.selectedSpecialItem.ItemPrice * this.state.order.selectedSpecialItem.quantity}</label>
                    </div>
                  </div>
                }
                <br />
                {
                  (this.state.order.selectedAddOnItems.length > 0 && this.state.order.selectedAddOnItems[0].quantity > 0) &&
                  <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12">
                      <label className="labeText">AddOn Item</label>&nbsp;&nbsp;
                          </div>
                  </div>
                }
                {
                  this.state.order.selectedAddOnItems.map((lst, index) => {
                    return (
                      lst.quantity > 0 &&
                      <div key={index} className="row">
                        <div valign="top" className="col-xs-4 col-sm-4 col-md-4">
                          <label className="labelTextNormal">{lst.ItemName}</label>
                        </div>
                        <div valign="top" className="col-xs-3 col-sm-3 col-md-3">
                          <label className="labelTextNormal">{lst.quantity}</label>
                        </div>
                        <div valign="top" className="col-xs-2 col-sm-2 col-md-2" ><br />
                          &nbsp;
                               </div>
                        <div valign="top" className="col-xs-3 col-sm-3 col-md-3"><br />
                          &nbsp;
                            </div>
                      </div>
                    )
                  })
                }
                <br />
                <div className="row">
                  <div className="col-xs-4 col-sm-4 col-md-4">
                  </div>
                  <div valign="top" className="col-xs-3 col-sm-3 col-md-3">
                  </div>
                  <div valign="top" className="col-xs-2 col-sm-2 col-md-2"><br />
                    <label className="labeText">Total</label>
                  </div>
                  <div valign="top" className="col-xs-3 col-sm-3 col-md-3"><br />
                    <label className="labeText">${(this.state.order.menuPrice * this.state.order.orderQuantity) + (this.state.order.selectedSpecialItem.ItemPrice * this.state.order.selectedSpecialItem.quantity)}</label>
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-xs-7 col-sm-7 col-md-7">
                    <label className="note"><b>Note:</b> Payment will be accepted at the time of delivery by <b>CASH</b>. We are working on the electronic payments.</label><br />
                  </div>
                  <div className="col-xs-5 col-sm-5 col-md-5">
                  </div>
                </div>
                <br/>
                <div className="row">
                  <div className="col-xs-7 col-sm-7 col-md-7">
                    <label className="labeText">Comments</label><br />
                    <textarea type="text" placeholder="Enter delivery or item related comments" className="form-control" rows="4" name="comments" value={this.state.order.comments} onChange={this.handleChange}></textarea>
                  </div>
                  <div className="col-xs-5 col-sm-5 col-md-5">
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xs-1 col-sm-1 col-md-1">
            </div>
            <br />
            <div className="row" >
              <div className="col-xs-1 col-sm-1 col-md-1">
              </div>
              <div className="col-xs-2 col-sm-2 col-md-2">
                <button type="button" className="btn btn-success clickable" onClick={this.GoToOrder}> &lt;&lt; Back</button>
              </div>
              <div className="col-xs-3 col-sm-3 col-md-3">
              </div>
              <div className="col-xs-2 col-sm-2 col-md-2">
                <button type="button" className="btn btn-success clickable" onClick={this.PlaceOrder}>Place Order</button>
              </div>
              <div className="col-xs-4 col-sm-4 col-md-4">
              </div>
            </div>
          </Carousel.Item>
        </Carousel>
        <Spinner show={this.state.loading} type='saving' />
        <ErrorComponent show={this.state.error} />
      </Aux1>
    );
  }
}


export default Order;