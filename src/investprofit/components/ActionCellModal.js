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
        description: '',
        value: '',
        dateInvestProfit: new Date(),
    });

    const [profitMode, setProfitMode] = useState();

    const [formError, setFormError] = useState(null);

    const close = () => {
        setModalValues({ show: false });
    }

    const open = (event) => {
        setModalValues({ show: true });
        console.log(rowData);
        rowData.value <= 0 ? setProfitMode(false) : setProfitMode(true);
        setformValue({
            description: rowData.description,
            value: rowData.value <= 0 ? -rowData.value : rowData.value,
            dateInvestProfit: new Date(rowData.dateInvestProfit),
        });
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

    const IPUpdateSubmitHandler = async event => {
        event.preventDefault();
        try {
            fetch(process.env.REACT_APP_BACKEND_URL + '/investprofit/' + rowData._id, {
                method: 'PATCH',
                headers: {
                    "Content-type": "application/json",
                    "Authorization": 'Bearer ' + auth.token
                },
                body: JSON.stringify({
                    description: formValue.description,
                    value: profitMode ? formValue.value : -formValue.value,
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

        } catch (error) {
            setFormError(error);
        }
    };

    const deleteIP = (id) => {
        try {
            fetch(process.env.REACT_APP_BACKEND_URL + '/investprofit/' + rowData._id, {
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
                    <Modal.Title>Update {rowData.value <= 0 ? "Investment" : "Profit"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {formError ? errorMessage : null}
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
                            <ControlLabel>Value in Rupees</ControlLabel>
                            <FormControl name="value" type="number" />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Date</ControlLabel>
                            <FormControl
                                name="dateInvestProfit"
                                accepter={DatePicker}
                                //defaultValue={new Date(formValue.datePurchase)}
                                format="DD-MM-YYYY"
                                placement="auto"
                            />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={IPUpdateSubmitHandler} appearance="primary">Update</Button>
                    <Button onClick={close} appearance="ghost">Cancel</Button>
                    <Button onClick={() => deleteIP(rowData._id)} float="left" color="red">Delete</Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default ActionCell;