import React, { useState, useContext } from 'react';
import { Modal, Button, Form, FormGroup, FormControl, ControlLabel, Message, RadioGroup, Radio, Notification, DatePicker } from 'rsuite';
import { AuthContext } from '../../shared/context/auth-context';

const AddStockModal = (props) => {

    const auth = useContext(AuthContext);

    const [formValue, setformValue] = useState({
        name: '',
        id: '',
        value: '',
        gender: 'male',
        datePurchase: new Date(),
    });

    const open = (funcName) => {
        Notification[funcName]({
            title: funcName,
            description: <div style={{ width: 320 }} rows={3}>Goat added</div>
        });
    }

    const [formError, setFormError] = useState(null);


    const handleChange = (value) => {
        setformValue(value);
    }

    const addItemSubmitHandler = (value) => {
        if (formValue.id.trim()) {
            setFormError(null);
            try {
                fetch(process.env.REACT_APP_BACKEND_URL + '/stock', {
                    method: 'post',
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": 'Bearer ' + auth.token
                    },
                    body: JSON.stringify({
                        id: formValue.id,
                        name: formValue.name,
                        value: formValue.value,
                        gender: formValue.gender,
                        datePurchase: formValue.datePurchase,
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
                //history.push('/');
            } catch (error) {
                setFormError(error);
            }

        } else {
            setFormError('You have to provide ID');
        }
    }

    let errorMessage = <Message type="error" description={formError} />

    return (
        <React.Fragment>
            <Modal.Header>
                <Modal.Title>Add Goat</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {formError ? errorMessage : null}
                <Form
                    fluid
                    onChange={handleChange}
                    formValue={formValue}
                >
                    <FormGroup>
                        <ControlLabel>ID</ControlLabel>
                        <FormControl name="id" type="number" />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Name</ControlLabel>
                        <FormControl name="name" type="text" />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Value in Rupees</ControlLabel>
                        <FormControl name="value" type="number" />
                    </FormGroup>

                    <FormGroup controlId="gender">
                        <RadioGroup defaultValue="male" name="gender" inline onChange={gender => {
                            setformValue({
                                ...formValue,
                                gender
                            });
                        }}>
                            <Radio value="male">Male</Radio>
                            <Radio value="female">Female</Radio>
                        </RadioGroup>
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>Date of purchase</ControlLabel>
                        <FormControl
                            name="datePurchase"
                            accepter={DatePicker}
                            format="DD-MM-YYYY"
                            placement="auto"
                        />
                    </FormGroup>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.close} onClick={addItemSubmitHandler} appearance="primary">
                    Save
                </Button>
                <Button onClick={props.close} appearance="ghost">
                    Cancel
                </Button>
            </Modal.Footer>
        </React.Fragment>
    );
}

export default AddStockModal;