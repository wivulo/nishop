import React from 'react';
import { Metadata } from 'next';
import Registration from './registration';

export const metadata: Metadata = {
    title: 'Registration',
}

function RegistrationPage() {
    return <Registration />
};

export default RegistrationPage;
