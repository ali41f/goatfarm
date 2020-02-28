import React from 'react';
import { Container, Content, Footer, Form, Panel, ButtonToolbar, Button, Message } from 'rsuite';
import Centerbox from '../../shared/components/UIElements/Centerbox';
import TextField from '../../shared/components/Form/Textfield';
import model from '../components/AuthSchema';
import { AuthContext } from '../../shared/context/auth-context';

import 'rsuite/dist/styles/rsuite-default.css';

class Login extends React.Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            formValue: {
                email: '',
                password: ''
            },
            formError: {
                email: "This field is required.",
                password: "This field is required."
            },
            serverError: '',
            errorMessage: []
        };
    }


    handleSubmit = async () => {
        try {
            fetch(process.env.REACT_APP_BACKEND_URL + '/users/login', {
                method: 'post',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    email: this.state.formValue.email,
                    password: this.state.formValue.password
                })
            })
                .then(async (response) => {
                    let responseData = await response.json();
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
                .then(async (data) => {
                    if (data) {
                        console.log(data);
                        const { login } = this.context;
                        login(data.userId, data.token);
                    }
                })
                .catch(function (error) { });

        } catch (err) {
            throw new Error(err.message);
        }

    }


    render() {
        const { formError, formValue } = this.state;
        let serverErr = <Message key='1' type="error" description={this.state.serverError} />;
        return (
            <div>

                <Container>
                    <Content>
                        <Centerbox>
                            {this.state.serverError ? serverErr : null}
                            <Panel header={<h3>Login</h3>} bordered>
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
                                    <TextField name="email" label="Email" />
                                    <TextField name="password" label="Password" type="password" />

                                    <ButtonToolbar>
                                        <Button disabled={Object.keys(formError).length !== 0} appearance="primary" onClick={this.handleSubmit}>Login</Button>
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

export default Login;