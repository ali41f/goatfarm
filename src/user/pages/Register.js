import React from 'react';
import { Container, Content, Footer, Form, Panel, ButtonToolbar, Button } from 'rsuite';
import Centerbox from '../../shared/components/UIElements/Centerbox';
import TextField from '../../shared/components/Form/Textfield';
import model from '../components/AuthSchema';

import 'rsuite/dist/styles/rsuite-default.css';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formValue: {
                name: '',
                email: '',
                password: '',
                verifyPassword: ''
            },
            formError: {}
        };
    }
    handleSubmit = () => {
        const { formValue } = this.state;
        if (!this.form.check()) {
            console.error('Form Error');
            return;
        }
        console.log(formValue, 'Form Value');
    }

    handleCheckEmail = () => {
        this.form.checkForField('email', checkResult => {
            console.log(checkResult);
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
                                    <TextField name="name" label="Username" />
                                    <TextField name="email" label="Email" />
                                    <TextField name="password" label="Password" type="password" />
                                    <TextField name="verifyPassword" label="Verify password" type="password" />


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

export default Register;