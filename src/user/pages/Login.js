import React from 'react';
import { Container, Content, Footer, Form, Panel, ButtonToolbar, Button } from 'rsuite';
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
            formError: {}
        };
    }

    componentDidMount() {

    }


    handleSubmit = async () => {
        const { dispatch } = this.context;
        console.log(dispatch);
        await dispatch({
            type: "LOGIN",
            payload: {
                isAuthenticated: true,
                user: 1,
                token: 123
            }
        });
        const { state } = this.context;
        console.log(state);
        /*
        const { formValue } = this.state;
        if (!this.form.check()) {
            console.error('Form Error');
            return;
        }
        console.log(formValue, 'Form Value');
        */
    }

    handleCheckEmail = () => {
        this.form.checkForField('email', checkResult => {
            console.log(checkResult);
        });
        const { dispatch } = this.context;
        dispatch({
            type: "LOGOUT"
        });
    }

    render() {
        const { formError, formValue } = this.state;

        return (
            <div>

                <Container>
                    <Content>
                        <Centerbox>
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
                                        <Button appearance="primary" onClick={this.handleSubmit}>Submit</Button>

                                        <Button onClick={this.handleCheckEmail}>Check Email</Button>
                                    </ButtonToolbar>
                                </Form>
                            </Panel>
                        </Centerbox>
                    </Content>
                    <Footer>Footer</Footer>
                </Container>

            </div>
        );
    }
}

export default Login;