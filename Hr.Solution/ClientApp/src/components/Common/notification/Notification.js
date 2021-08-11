import { faCheckCircle, faExclamationCircle, faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { store } from 'react-notifications-component';
import { NotificationType } from './Constants';

export function ShowNotification(type, message) {
    let icon = null;
    switch (type) {
        case NotificationType.SUCCESS:
            icon = <FontAwesomeIcon icon={faCheckCircle} />;
            break;
        case NotificationType.ERROR:
            icon = <FontAwesomeIcon icon={faTimesCircle} />;
            break;
        case NotificationType.INFO:
            icon = <FontAwesomeIcon icon={faInfoCircle} />;
            break;
        case NotificationType.WARNING:
            icon = <FontAwesomeIcon icon={faExclamationCircle} />;
            break;
        default:
            break;
    }

    store.addNotification({
        title: "HR Solution",
        message: <span>{icon} {message}</span>,
        type: type,
        insert: "top",
        container: "bottom-right",
        animationIn: ["animate__animated", "animate__bounceInRight"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 3000,
            onScreen: true
        }
    });
}
