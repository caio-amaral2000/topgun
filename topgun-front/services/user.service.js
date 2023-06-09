import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from 'helpers';

const { publicRuntimeConfig } = getConfig();
const baseUrl = "http://127.0.0.1:8000";
const userSubject = new BehaviorSubject(process.browser && JSON.parse(localStorage.getItem('user')));

export const userService = {
    user: userSubject.asObservable(),
    get userValue () { return userSubject.value },
    login,
    logout,
    register,
    createPilot,
    getUsers,
    getPilotData,
    createFlight,
    graduateStudent,
    promotePilot,
    getInstructedFlights,
    delete: _delete
};

function login(username, password) {
    return fetchWrapper.post(`${baseUrl}/login`, { username, password })
        .then(user => {
            // publish user to subscribers and store in local storage to stay logged in between page refreshes
            userSubject.next(user);
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        });
}

function logout() {
    // remove user from local storage, publish null to user subscribers and redirect to login page
    localStorage.removeItem('user');
    userSubject.next(null);
    Router.push('/account/login');
}

function register(user) {
    return fetchWrapper.post(`${baseUrl}/register`, user);
}

function createPilot(user) {
    return fetchWrapper.post(`${baseUrl}/create-pilot`, user);
}

function getUsers() {
    return fetchWrapper.get(`${baseUrl}/users`);
}

function getPilotData(id) {
    return fetchWrapper.get(`${baseUrl}/pilot-data/${id}`);
}

function createFlight(id, data) {
    return fetchWrapper.post(`${baseUrl}/create-flight/${id}`, data);
}

function graduateStudent(id, data) {
    return fetchWrapper.put(`${baseUrl}/graduate/${id}`, data);
}

function promotePilot(id, data) {
    return fetchWrapper.put(`${baseUrl}/promote/${id}`, data);
}

function getInstructedFlights(id) {
    return fetchWrapper.get(`${baseUrl}/instructed-flights/${id}`);
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(id) {
    return fetchWrapper.delete(`${baseUrl}/${id}`);
}
