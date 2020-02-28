import React from 'react';
import { Container, Content, Footer, Form, Panel, ButtonToolbar, Button, Message } from 'rsuite';
import Centerbox from '../../shared/components/UIElements/Centerbox';
import TextField from '../../shared/components/Form/Textfield';
import model from '../components/AuthSchema';
import { AuthContext } from '../../shared/context/auth-context';

import 'rsuite/dist/styles/rsuite-default.css';

class Register extends React.Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            formValue: {
                name: '',
                email: '',
                password: '',
                verifyPassword: ''
            },
            formError: {
                email: "This field is required.",
                password: "This field is required.",
                verifyPassword: "This field is required."
            },
            serverError: '',
            errorMessage: []
        };
    }
    handleSubmit = () => {
        if (this.formCheckOk()) {
            try {
                this.setState({
                    ...this.state,
                    serverError: ''
                });
                fetch(process.env.REACT_APP_BACKEND_URL + '/users/signup', {
                    method: 'post',
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        name: this.state.formValue.name,
                        email: this.state.formValue.email,
                        password: this.state.formValue.password
                    })
                })
                    .then(async (response) => {
                        let responseData = await response.json();
                        //console.log(responseData);
                        if (response.ok) {
                            return responseData;
                        } else {
                            this.setState({
                                ...this.state,
                                serverError: responseData.message
                            });
                            return false;
                        }
                    })
                    .then((data) => {
                        if (data) {
                            console.log(data);
                            const { login } = this.context;
                            login(data.userId, data.token);
                        }
                    })
                    .catch((error) => { });

            } catch (error) {
                console.log(error.message);
            }
        } else {
            console.log("form validation errors");
        }
    }

    formCheckOk = () => {
        const checkResult = model.check({
            name: this.state.formValue.name,
            email: this.state.formValue.email,
            password: this.state.formValue.password,
            verifyPassword: this.state.formValue.verifyPassword
        });
        this.setState({
            ...this.state,
            errorMessage: []
        });
        const entries = Object.entries(checkResult);
        let formValidated = true;
        let errorArray = [];
        let errorIndex = 0;
        entries.map((arr) => {
            formValidated = formValidated && !arr[1].hasError;
            if (arr[1].hasError) {
                errorArray[errorIndex] = arr[0] + ": " + arr[1].errorMessage;
                errorIndex++;
            }
            return null;
        });
        if (!formValidated) {
            this.setState({
                ...this.state,
                errorMessage: errorArray
            });
        }
        return formValidated;
    }

    render() {
        const { formError, formValue } = this.state;
        let validationErrorMessage = [];
        if (this.state.errorMessage.length) {
            this.state.errorMessage.map(err =>
                validationErrorMessage.push(<Message key={err} type="error" description={err} />)
            )
        } else {
            validationErrorMessage = '';
        }
        let serverErr = <Message key='1' type="error" description={this.state.serverError} />;

        return (
            <div>
                <Container>
                    <Content>
                        <Centerbox>
                            {validationErrorMessage}
                            {this.state.serverError ? serverErr : null}
                            <Panel header={<h3>Register</h3>} bordered>
                                <Form fluid
                                    ref={ref => (this.form = ref)}
                                    onChange={formValue => {
                                        this.setState({ formValue });
                                    }}
                                    onCheck={formError => {
                                        this.setState({ formError });
                                    }}
                                    formValue={formValue}
                                    model={model}
                                >
                                    <TextField name="name" label="Username" />
                                    <TextField name="email" label="Email" />
                                    <TextField name="password" label="Password" type="password" />
                                    <TextField name="verifyPassword" label="Verify password" type="password" />

                                    <ButtonToolbar>
                                        <Button disabled={Object.keys(formError).length !== 0} appearance="primary" onClick={this.handleSubmit}>Submit</Button>
                                    </ButtonToolbar>
                                </Form>
                            </Panel>
                        </Centerbox>
                    </Content>
                    <Footer></Footer>
                </Container>

            </div>
        );
    }
}

export default Register;