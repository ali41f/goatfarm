import React from 'react';
import { Schema } from 'rsuite';

const { StringType, NumberType } = Schema.Types;

const model = Schema.Model({
    name: StringType().isRequired('This field is required.'),
    email: StringType().isEmail('Please enter a valid email address.').isRequired('This field is required.'),
    password: StringType().isRequired('This field is required.').minLength(6, 'The field cannot be less than 6 characters'),
    verifyPassword: StringType()
        .addRule((value, data) => {
            if (value !== data.password) {
                return false;
            }
            return true;
        }, 'The two passwords do not match')
        .isRequired('This field is required.')
});

export default model;