import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getLSItem } from "./LocalStorage";

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        getLSItem('auth_token') 
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
)

export const GuestRoute= ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        getLSItem('auth_token')
        ? JSON.parse(getLSItem('user')).type==="M"? <Redirect to={{ pathname: '/user-edit-profile', state: { from: props.location } }} />
        : JSON.parse(getLSItem('user')).type==="C"? <Redirect to={{ pathname: '/club-edit-profile', state: { from: props.location } }} />
        :JSON.parse(getLSItem('user')).type==="T"?<Redirect to={{ pathname: '/trainer-edit-profile', state: { from: props.location } }} />
        :<Redirect to={{ pathname: '#', state: { from: props.location } }} />
        : <Component {...props} />
    )} />
)

export const UserRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        getLSItem('auth_token') && JSON.parse(getLSItem('user')).type==="M"
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
)

export const ClubRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        getLSItem('auth_token') && JSON.parse(getLSItem('user')).type==="C" 
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
)

export const TrainerRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        getLSItem('auth_token') && JSON.parse(getLSItem('user')).type==="T" 
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />

)

export const NotUserRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        (getLSItem('auth_token')?
        JSON.parse(getLSItem('user')).type!=="M"
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/user-edit-profile', state: { from: props.location } }} />
            :<Redirect to={{ pathname: '/login', state: { from: props.location } }} />)
    )} />
)

export const NotClubRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        (getLSItem('auth_token')?
        JSON.parse(getLSItem('user')).type!=="C"
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/user-edit-profile', state: { from: props.location } }} />
            :<Redirect to={{ pathname: '/login', state: { from: props.location } }} />)
    )} />
)
