import React, { Component, Children } from 'react';

// base Component
import { ModalContainer, ModalBody } from '../shared/Modal';
// child Components
import NewModal from './modals/new.modal';

/*
    This is the parent component for all modals. this Component will handle opening/closing the various modals' bodies
*/

export default function Modals (props) {
    return (
        <ModalContainer>
            <newModal/>
        </ModalContainer>
    )
}
