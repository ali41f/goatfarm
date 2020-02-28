import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Table, Icon, IconButton, Paragraph } from 'rsuite';
import { Modal, Button, Form, FormGroup, FormControl, ControlLabel, Message, RadioGroup, Radio, Notification, DatePicker } from 'rsuite';
import { AuthContext } from '../../shared/context/auth-context';
const { Column, HeaderCell, Cell } = Table;

const ActionCell = ({ rowData, dataKey, updateDataTable, ...props }) => {

    const history = useHistory();

    //const { updateDataTable } = props;

    const auth = useContext(AuthContext);

    const [modalValues, setModalValues] = useState({
        show: false
    });

    const [formValue, setformValue] = useState({
        name: '',
        id: '',
        value: '',
        gender: '',
        datePurchase: new Date(),
    });

    const [formError, setFormError] = useState(null);

    const close = () => {
        setModalValues({ show: false });
    }

    const open = (event) => {
        setModalValues({ show: true });
        setFormError(null);
        console.log(rowData);
        setformValue({
            name: rowData.name,
            id: rowData.sid,
            value: rowData.value || '',
            gender: rowData.gender,
            datePurchase: new Date(rowData.datePurchase),
        });
    }

    function handleAction() {
        alert(`id:${rowData[dataKey]}`);
    }

    const handleChange = (value) => {
        setformValue(value);
    }

    const openNotification = (funcName, des) => {
        Notification[funcName]({
            title: funcName,
            description: <div style={{ width: 320 }} rows={3}>{des}</div>
        });
    }

    const stockUpdateSubmitHandler = async event => {
        event.preventDefault();
        setFormError(null);
        try {
            fetch(process.env.REACT_APP_BACKEND_URL + '/stock/' + rowData._id, {
                method: 'PATCH',
                headers: {
                    "Content-type": "application/json",
                    "Authorization": 'Bearer ' + auth.token
                },
                body: JSON.stringify({
                    sid: formValue.id,
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
                        console.log("data from response: " + data);
                        //updateDataTable(rowData, formValue);
                        updateDataTable();
                        openNotification('success', 'Item updated');
                        close();
                    }
                })
                .catch((error) => {
                    setFormError(error);
                });
            //history.push('/');
        } catch (error) {
            setFormError(error);
        }
    };

    const deleteStock = (id) => {
        try {
            fetch(process.env.REACT_APP_BACKEND_URL + '/stock/' + rowData._id, {
                method: 'DELETE',
                headers: {
                    "Content-type": "application/json",
                    "Authorization": 'Bearer ' + auth.token
                }
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
                        console.log("data from response: " + data.message);
                        //updateDataTable(rowData, formValue);
                        updateDataTable();
                        close();
                        openNotification('success', 'Item deleted');
                    }
                })
                .catch((error) => {
                    setFormError(error);
                });
        } catch (error) {
            setFormError(error);
        }
    };

    let errorMessage = <Message type="error" description={formError} />
    //console.log(rowData);
    return (
        <React.Fragment>
            <Cell {...props} className="link-group">
                <IconButton
                    appearance="subtle"
                    onClick={open}
                    icon={<Icon icon="edit2" />}
                />
            </Cell>

            <Modal show={modalValues.show} onHide={close}>
                <Modal.Header>
                    <Modal.Title>Update Item</Modal.Title>
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
                            <ControlLabel>name</ControlLabel>
                            <FormControl name="name" type="text" />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Value in Rupees</ControlLabel>
                            <FormControl name="value" type="number" />
                        </FormGroup>
                        <FormGroup controlId="gender">
                            <RadioGroup name="gender" defaultValue={formValue.gender} inline onChange={gender => {
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
                                //defaultValue={new Date(formValue.datePurchase)}
                                format="DD-MM-YYYY"
                                placement="auto"
                            /*
                            onChange={datePurchase => {
                                setformValue({
                                    ...formValue,
                                    datePurchase
                                });
                            }}
                            */
                            />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={stockUpdateSubmitHandler} appearance="primary">Update</Button>
                    <Button onClick={close} appearance="ghost">Cancel</Button>
                    <Button color="red" onClick={() => deleteStock(rowData.id)}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default ActionCell;