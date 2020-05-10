import { Modal, Button } from 'react-bootstrap'
import React, { Component } from 'react';

class BootStrapModel extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        {/* <BootStrapModal showModal={this.state.loading} titleText="12PM Lunch" modalClassName="alertModal"
                    cancelHandler={this.closeModal} cancelButtonText="Cancel"
                    confirmHandler={this.closeModal} confirmButtonText="Ok">
                    <label>Test hello</label>
                </BootStrapModal> */}
        return (
            <Modal
                show={this.props.showModal}
                onHide={this.props.handleModalClose} dialogClassName={!this.props.modalClassName ? '' : this.props.modalClassName}>
                {this.props.titleText &&
                    <Modal.Header closeButton>
                        <Modal.Title
                            className="labeText">{this.props.titleText}</Modal.Title>
                    </Modal.Header>}
                <Modal.Body>
                    {this.props.children}
                </Modal.Body>
                {(this.props.confirmHandler || this.props.cancelHandler) &&
                    <Modal.Footer>
                        {this.props.confirmHandler &&
                            <Button
                                onClick={this.props.confirmHandler}>{!this.props.confirmButtonText ? "OK" : this.props.confirmButtonText}</Button>}
                        {this.props.cancelHandler &&
                            < Button
                                onClick={this.props.cancelHandler}>{!this.props.cancelButtonText ? "Close" : this.props.cancelButtonText}</Button>}
                    </Modal.Footer>
                }
            </Modal >
        )
    }
}
export default BootStrapModel;