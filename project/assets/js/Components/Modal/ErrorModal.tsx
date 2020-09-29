import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

interface IProps {
    modal: boolean,
    toggleModal(par1?: string|undefined): void,
    message: string
}

class ErrorModal extends React.Component<IProps, any> {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div>
                <Modal show={this.props.modal} onHide={this.props.toggleModal}>
                    <Modal.Body>
                        <div className={"modal-text"}>{this.props.message}</div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => this.props.toggleModal()}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default ErrorModal;