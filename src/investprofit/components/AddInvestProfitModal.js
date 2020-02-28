import React, { useState, useContext } from 'react';
import { Modal, Button, Form, FormGroup, FormControl, ControlLabel, Message, Notification, DatePicker } from 'rsuite';
import { AuthContext } from '../../shared/context/auth-context';

const AddInvestProfitModal = (props) => {

    const auth = useContext(AuthContext);

    const [formValue, setformValue] = useState({
        description: '',
        value: '',
        dateInvestProfit: new Date(),
    });

    const open = (funcName) => {
        Notification[funcName]({
            title: funcName,
            description: <div style={{ width: 320 }} rows={3}>{props.profitMode ? "Profit added" : "Investment added"}</div>
        });
    }

    const [formError, setFormError] = useState(null);


    const handleChange = (value) => {
        setformValue(value);
    }

    const addInvestProfitSubmitHandler = (value) => {
        setFormError(null);
        if (!!formValue.value && !!formValue.description) {
            console.log('no front error')
            try {
                fetch(process.env.REACT_APP_BACKEND_URL + '/investprofit', {
                    method: 'post',
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": 'Bearer ' + auth.token
                    },
                    body: JSON.stringify({
                        description: formValue.description,
                        value: props.profitMode ? parseInt(formValue.value) : -parseInt(formValue.value),
                        dateInvestProfit: formValue.dateInvestProfit,
                    })
                })
                    .then(async (response) => {
                        let responseData = await response.json();
                        //console.log(responseData);
                        if (response.ok) {
                            return responseData;
                        } else {
                            setFormError(responseData.message);
                            return false;
                        }
                    })
                    .then((data) => {
                        if (data) {
                            console.log('data yo' + data);
                            props.close();
                            open('success');
                            setTimeout(() => {
                                auth.refresh(true)
                            }, 500);

                        }
                    })
                    .catch((error) => {
                        setFormError(error);
                    });
            } catch (error) {
                setFormError(error);
            }
        } else {
            setFormError('Description and value are required');
            console.log('front error')
        }


    }

    let errorMessage = <Message type="error" description={formError} />

    return (
        <React.Fragment>
            <Modal.Header>
                <Modal.Title>{props.profitMode ? "Add Profit" : "Add Investment"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {formError ? errorMessage : null
                }
                <Form
                    fluid
                    onChange={handleChange}
                    formValue={formValue}
                >
                    <FormGroup>
                        <ControlLabel>Description</ControlLabel>
                        <FormControl name="description" type="text" />
                    </FormGroup>

                    <FormGroup>
                        <ControlLabel>{props.profitMode ? "Profit in Rupees" : "Investment value in Rupees"}</ControlLabel>
                        <FormControl name="value" type="number" />
                    </FormGroup>

                    <FormGroup>
                        <ControlLabel>{props.profitMode ? "Date of Profit" : "Date of Investment"}</ControlLabel>
                        <FormControl
                            name="dateInvestProfit"
                            accepter={DatePicker}
                            format="DD-MM-YYYY"
                            placement="auto"
                        />
                    </FormGroup>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.close} onClick={addInvestProfitSubmitHandler} appearance="primary">Save</Button>
                <Button onClick={props.close} appearance="ghost">Cancel</Button>
            </Modal.Footer>
        </React.Fragment>
    );
}

export default AddInvestProfitModal;