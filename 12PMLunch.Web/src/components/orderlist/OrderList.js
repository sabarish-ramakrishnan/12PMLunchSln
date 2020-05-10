import React, { Component } from 'react';
import OrderApi from '../../api/OrderApi';
import DatePicker from 'react-date-picker';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import './OrderList.css';
import '../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import common from '../../common/common'
import { Redirect } from 'react-router'
import { Link, withRouter } from 'react-router-dom';
import ErrorComponent from '../common/ErrorComponent/ErrorComponent';
import Spinner from '../../components/common/Spinner/Spinner'
import BootStrapModal from '../../components/common/BootstrapModal/BootstrapModal'
var _ = require('lodash');

class OrderList extends Component {

    // constructor(props) {
    //     super(props);

    state = {
        orders: [],
        filteredOrders: [],
        loading: false,
        fromDate: common.addDaysTodate(new Date(), -7),
        toDate: common.addDaysTodate(new Date(), 7),
        emailId: '',
        error: false,
        deleteConfirm: false,
        orderid: 0
    }
    //this.InputChangeHandler = this.InputChangeHandler.bind(this);
    //}
    componentWillMount() {
        this.props.headerBanner(false);
    }
    componentDidMount() {
        // var fdate = new Date();
        // fdate.setDate(fdate.getDate() - 16);
        // var tdate = new Date();
        // tdate.setDate(tdate.getDate());
        // this.setState({ fromDate: fdate, toDate: tdate });

        if (common.isAuthenticated())
            this.loadOrders();
        else
            this.props.history.push('/login');
    }

    loadOrders = () => {
        let reqObject = {
            fromDatestr: common.getFormattedDate(this.state.fromDate),
            toDatestr: common.getFormattedDate(this.state.toDate),
            currentUser: common.getcurrentUserEmail()
        }
        this.setState({ error: false, loading: true });
        OrderApi.getAllOrders(reqObject)
            .then((response) => {
                var responseData;
                //let responseData = response.body;
                if (common.IsUserAdmin()) {
                    responseData = _.sortBy(response.body, 'OrderDate', function (n) {
                        return Math.sin(n);
                    }).reverse();
                }
                else
                {
                    responseData = response.body;
                }
                if (response.status != 200)
                    this.setState({ error: true, loading: false });
                else if (!responseData || responseData == null) {
                    //console.log('User not found');
                    this.setState({ error: true, loading: false });
                }
                else
                    this.setState({ loading: false, orders: responseData, filteredOrders: responseData });
            }).catch((err) => {
                console.log(err);
                this.setState({ error: true, loading: false });
            });
    }

    onFromDateChange = (value) => {
        this.setState({ fromDate: value });
        //this.loadOrders();
    }
    onToDateChange = (value) => {
        this.setState({ toDate: value });
        //this.loadOrders();
    }
    InputChangeHandler = (event) => {
        //debugger;
        ///if (event.target.id = 'emailId') {
        this.setState({ emailId: event.target.value });
        //F}
    }
    closeModal = () => {
        this.setState({ deleteConfirm: false });
    }
    deleteOrder = () => {
        //console.log(this.state.orderid);
        let reqObject = {
            OrderId: this.state.orderid,
            RequestedUser: {
                EmailId: common.getcurrentUserEmail()
            }
        }
        this.setState({ error: false, loading: true });
        OrderApi.deleteOrder(reqObject)
            .then((response) => {
                let responseData = response.body;
                if (response.status != 200)
                    this.setState({ error: true, loading: false, deleteConfirm: false });
                else if (!responseData || responseData == null || responseData.UserId < 0) {
                    //console.log('User not found');
                    this.setState({ error: true, loading: false, deleteConfirm: false });
                }
                else {
                    this.setState({ loading: false, deleteConfirm: false });
                    this.loadOrders();
                }
            }).catch((err) => {
                console.log(err);
                this.setState({ error: true, loading: false, deleteConfirm: false });
            });
    }

    deleteClick = (cell, row, rowIndex) => {
        //console.log("edit clicked");
        //console.log('Product #', row);
        this.setState({ orderid: row.OrderId, deleteConfirm: true });
    }

    deleteButtonFormatter(cell, row, enumObject, rowIndex) {
        let deleteButton = <button type="button" onClick={() => this.deleteClick(cell, row, rowIndex)}>Delete</button>;
        let orderDate = new Date(row.OrderDate);
        let currentDate = new Date();
        //console.log('hours', currentDate.getHours());
        let cancelButtonText = common.IsUserAdmin() ? 'Cancel' : 'Cancel Order';
        if (row.OrderStatusCode == 1 && orderDate >= currentDate && currentDate.getHours() < 21)
            return (
                <button type="button" onClick={() => this.deleteClick(cell, row, rowIndex)} className="btn btn-success">{cancelButtonText}</button>
            )
        else
            return (
                <button type="button" disabled={true} className="btn btn-disabled">{cancelButtonText}</button>
            )
    }
    render() {
        // function nestedFormatter(data, cell) {
        //     return `<p>${cell[data]}</p>`;
        // }
        function formatPhoneNumber(cell, row) {
            var s2 = ("" + cell).replace(/\D/g, '');
            var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
            return (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
        }
        function formatPhone(val) {
            var s2 = ("" + val).replace(/\D/g, '');
            var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
            return (!m) ? null : "(" + m[1] + ") " + m[2] + "-" + m[3];
        }
        function currencyFormatter(cell, row) {
            return '$ ' + row.TotalAmount.toFixed(2);
        }
        function menuNameFormatter(cell, row) {
            return <span title={cell.MenuTypeName}>{cell.MenuTypeName}</span>;
        }

        function emailFormatter(cell, row) {
            return <a href={"mailto:" + cell} title={formatPhone(row.OrderContactNo) + '\n' + row.OrderedBy + '\n' + cell}>{row.OrderedBy}</a>;
        }
        function tooltipFormatter(cell, row) {
            return <span title={cell}>{cell}</span>;
        }
        function trimFormatter(cell, row) {
            return <span title={cell}>{cell.slice(0, 1)}</span>;
        }

        const startingDate = new Date(2018, 0, 1);
        let gridContent = null;
        const IsAdminUser = common.IsUserAdmin();
        if (this.state.filteredOrders && this.state.filteredOrders.length > 0 && IsAdminUser) {
            gridContent = <BootstrapTable data={this.state.filteredOrders} striped hover>
                <TableHeaderColumn isKey dataField='OrderNumber' filter={{ type: 'TextFilter', delay: 250 }} dataFormat={tooltipFormatter}>OrderNumber</TableHeaderColumn>
                <TableHeaderColumn dataField='OrderDateStr' filter={{ type: 'TextFilter', delay: 250 }}>Menu Date</TableHeaderColumn>
                <TableHeaderColumn dataField='OrderByEmail' dataFormat={emailFormatter} filter={{ type: 'TextFilter', delay: 250 }}>Requested By</TableHeaderColumn>
                <TableHeaderColumn dataField='MenuType' dataFormat={menuNameFormatter}>Menu Name</TableHeaderColumn>
                {/* <TableHeaderColumn dataField='OrderContactNo' dataFormat={formatPhoneNumber} filter={{ type: 'TextFilter', delay: 250 }}>Mobile</TableHeaderColumn> */}
                <TableHeaderColumn dataField='OrderQuantity'>Quantity</TableHeaderColumn>
                <TableHeaderColumn dataField='OtherItems' dataFormat={tooltipFormatter}>Other Items</TableHeaderColumn>
                <TableHeaderColumn dataField='RequestedUser' dataFormat={currencyFormatter}>Total Amount</TableHeaderColumn>
                <TableHeaderColumn dataField='OrderStatus' filter={{ type: 'TextFilter', delay: 250 }} dataFormat={trimFormatter}>Status</TableHeaderColumn>
                <TableHeaderColumn dataField='Comments' filter={{ type: 'TextFilter', delay: 250 }} dataFormat={tooltipFormatter}>Comments</TableHeaderColumn>
                <TableHeaderColumn dataField='button' dataFormat={this.deleteButtonFormatter.bind(this)} />
            </BootstrapTable>
        }
        else if (this.state.filteredOrders && this.state.filteredOrders.length > 0 && !IsAdminUser) {
            gridContent = <BootstrapTable data={this.state.filteredOrders} striped hover>
                <TableHeaderColumn isKey dataField='OrderNumber' filter={{ type: 'TextFilter', delay: 250 }} dataFormat={tooltipFormatter}>OrderNumber</TableHeaderColumn>
                <TableHeaderColumn dataField='OrderDateStr' filter={{ type: 'TextFilter', delay: 250 }}>Menu Date</TableHeaderColumn>
                <TableHeaderColumn dataField='MenuType' dataFormat={menuNameFormatter}>Menu Name</TableHeaderColumn>
                <TableHeaderColumn dataField='OrderQuantity'>Quantity</TableHeaderColumn>
                <TableHeaderColumn dataField='OtherItems' dataFormat={tooltipFormatter}>Other Items</TableHeaderColumn>
                <TableHeaderColumn dataField='RequestedUser' dataFormat={currencyFormatter}>Total Amount</TableHeaderColumn>
                <TableHeaderColumn dataField='OrderStatus' filter={{ type: 'TextFilter', delay: 250 }}>Order Status</TableHeaderColumn>
                <TableHeaderColumn dataField='RequestedDateStr' filter={{ type: 'TextFilter', delay: 250 }} dataFormat={tooltipFormatter}>Requested Date</TableHeaderColumn>
                <TableHeaderColumn dataField='button' dataFormat={this.deleteButtonFormatter.bind(this)} />
            </BootstrapTable>
        }
        else {
            gridContent = <div>{!IsAdminUser ? "You don't have any orders" : "There are no orders"}</div>;
        }
        return (
            <div className="container ContactData">
                <div className="row" style={{ marginBottom: '20px' }}>
                    <div className="col-xs-12 col-md-12 col-sm-12">
                        <h2>{IsAdminUser ? 'Orders' : 'My Orders'}</h2>
                    </div>
                </div>

                <div className="row" style={{ marginBottom: '10px' }}>
                    <div className="col-xs-12 col-md-12 col-sm-12">
                        <div className="form-group col-xs-2 col-md-2 col-sm-2">
                            <label >From Date</label>
                            <DatePicker className="DatePicker clickable"
                                id="fromDate"
                                onChange={this.onFromDateChange}
                                value={this.state.fromDate}
                                maxDate={common.addDaysTodate(new Date(), 10)}
                                minDate={startingDate} />
                        </div>
                        <div className="form-group col-xs-2 col-md-2 col-sm-2">
                            <label >To Date</label>
                            <DatePicker className="DatePicker clickable"
                                id="toDate"
                                onChange={this.onToDateChange}
                                value={this.state.toDate}
                                maxDate={common.addDaysTodate(new Date(), 10)}
                                minDate={this.state.fromDate} />
                        </div>
                        <div className="form-group col-xs-2 col-md-2 col-sm-2" style={{ paddingTop: 20 }}>
                            <button className='btn btn-success clickable' onClick={this.loadOrders}>Search</button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-md-12 col-sm-12">
                        {!this.state.error && gridContent}
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-md-12 col-sm-12">
                        <ErrorComponent show={this.state.error} />
                    </div>
                </div>
                <Spinner show={this.state.loading && !this.state.error} type='loading' >
                </Spinner>
                <BootStrapModal showModal={this.state.deleteConfirm} titleText="12PM Lunch" modalClassName="alertModal"
                    cancelHandler={this.closeModal} cancelButtonText="Cancel"
                    confirmHandler={this.deleteOrder} confirmButtonText="Ok">
                    <label>Are you sure you wish to cancel this order?</label>
                </BootStrapModal>
            </div>
        )
    }
}



export default withRouter(OrderList);