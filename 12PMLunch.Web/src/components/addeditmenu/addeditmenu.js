import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Overlay, Popover, Carousel } from 'react-bootstrap';
import DatePicker from 'react-date-picker';
import { Link } from 'react-router-dom'
import MenuApi from '../../api/MenuApi';
import './addeditmenu.css';
import common from '../../common/common';
import Spinner from '../../components/common/Spinner/Spinner';
import ErrorComponent from '../../components/common/ErrorComponent/ErrorComponent';
import Aux1 from '../common/hoc/Aux1/Aux1';
import AppOrderActions from '../../actions/AppOrderActions';
import AppOrderStore from '../../stores/AppOrderStore';
import AppMenuStore from '../../stores/AppMenuStore';
import BootStrapModal from '../../components/common/BootstrapModal/BootstrapModal';
import NumericInput from 'react-numeric-input';

class Order extends Component {

  constructor(props) {
    super(props);

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
      dailymenu: {
        menuDate: common.addDaysTodate(new Date(), 1),
        menuId: this.props.match.params.menuId && this.props.match.params.menuId != null ? this.props.match.params.menuId : 0,
        comments: '',
        menuName: '',
        Price: '',
        ImageUrl: '',
        menuTypes: [],
        mainItems: [],
        addOnItems: [],
        specialItems: []
      },
      error: false,
      loading: false,
      submitFlag: false
    };
  };

  componentWillMount() {
    this.props.headerBanner(false);
  }


  _onSubmit = () => {

  }

  handleDateChange = (date) => {
    //console.log('date:' + date);
    let order = this.state.order;
    order["menuDate"] = date;
    this.setState({ order: order });
    this.getMenuByDate();
  }

  getMenuByDate() {

    let dailymenu = {
      menuDate: common.addDaysTodate(new Date(), 1),
      menuId: this.props.match.params.menuId && this.props.match.params.menuId != null ? this.props.match.params.menuId : 0,
      comments: '',
      menuName: '',
      Price: '',
      ImageUrl: '',
      IsActive: true,
      menuTypes: [],
      mainItems: [],
      addOnItems: [],
      specialItems: []
    }
    //this.setState({ order: order });
    let menuObj = AppMenuStore.getMenuByDate(this.state.order.menuDate);
    if (menuObj !== null && menuObj !== undefined) {
      this.populateMenuType(menuObj);
    }

  }

  populateMenuType(data) {

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
    const updateddailymenu = {
      ...this.state.dailymenu
    };
    if (event.target.id.trim() === "txtMenuName") {
      updateddailymenu.menuName = event.target.value;
    }
    if (event.target.id.trim() === "txtMenuDesc") {
      updateddailymenu.comments = event.target.value;
    }
    if (event.target.id.trim() === "fuImage") {
      updateddailymenu.ImageUrl = event.target.value;
    }
    this.setState({ dailymenu: updateddailymenu });
  };
  aprtmentchangeHandler = (val) => {
    const updateddailymenu = {
      ...this.state.dailymenu
    };
    updateddailymenu.Price = val;
    this.setState({ dailymenu: updateddailymenu });
  }
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
      <div className="container ContactData">
        <div className="row" style={{ paddingLeft: '15px', marginBottom: '20px' }}>
          <div className="col-xs-12 col-md-12 col-sm-12">
            <label className="h2">Add Menu</label>
            <span className='small' style={{ marginLeft: '20px', color: 'Red' }}>All fields are mandatory.</span>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-md-6 col-sm-12">
            <div className="form-group">
              <label className="labeText">Date</label><br />
              <div className="clickable" style={{ zIndex: 1000, position: 'relative' }}>
                <DatePicker id="menuDatepicker" className="clickable" minDate={this.state.datePickerMinValue} value={this.state.dailymenu.menuDate} onChange={this.handleDateChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="labeText">Menu Name</label><br />
              <div>
                <input id="txtMenuName" className="form-control" onChange={this.handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label className="labeText">Menu Desc</label><br />
              <div>
                <textarea id="txtMenuDesc" className="form-control" onChange={this.handleChange} rows="3" />
              </div>
            </div>
            <div className="form-group">
              <label className="labeText">Image</label><br />
              <div>
                <input id="fuImage" type="file" className="form-control" onChange={this.handleChange} rows="3" />
              </div>
            </div>
            <div className="form-group">
              <label className="labeText">Price</label><br />
              <div>
                <NumericInput min={0} max={10} className="form-control" onChange={this.aprtmentchangeHandler} />
              </div>
            </div>
          </div>
        </div>
        <div className="row" style={{ paddingLeft: '15px', paddingTop: '10px' }}>
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
    // return (
    //   <Aux1>
    //     <Carousel
    //       activeIndex={this.state.carouselIndex}
    //       direction={this.state.carouselDirection}
    //     >
    //       <Carousel.Item>
    //         <div style={{ textAlign: 'left' }}>
    //           <br />
    //           <br />
    //           <div className="row">
    //             <div className="col-xs-1 col-sm-1 col-md-1">
    //             </div>
    //             <div className="col-xs-10 col-sm-10 col-md-10 divBorder" style={{ minHeight: '500px' }} >
    //               <div className="row">
    //                 <div className="col-xs-12 col-sm-12 col-md-12" style={{ textAlign: 'center' }}>
    //                   <label className="orderHeader">MENU OPTIONS</label>
    //                 </div>
    //               </div>
    //               <div className="row">
    //                 <div className="col-xs-2 ccol-sm-2 col-md-2" style={{ marginLeft: '15px' }}>
    //                   <label className="labeText">Date</label><br />
    //                   <div className="clickable" style={{ zIndex: 1000, position: 'relative' }}>
    //                     <DatePicker id="menuDatepicker" className="clickable" minDate={this.state.datePickerMinValue} value={this.state.dailymenu.menuDate} onChange={this.handleDateChange} />
    //                   </div>
    //                 </div>
    //                 <div className="col-xs-10 col-sm-10 col-md-10">
    //                 </div>
    //               </div>
    //               <br />
    //             </div>
    //             <div className="col-xs-1 col-sm-1 col-md-1"></div>
    //           </div>
    //         </div>
    //       </Carousel.Item>
    //     </Carousel>
    //     <Spinner show={this.state.loading} type='saving' />
    //     <ErrorComponent show={this.state.error} />
    //   </Aux1>
    // );
  }
}


export default Order;