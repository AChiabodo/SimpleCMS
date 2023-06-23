/**
 * All the API calls
 */

import { mapFromComponent, mapFromPage, mapToComponent, mapToPage } from "./Page";

const URL = 'http://localhost:3001/api';

function getJson(httpResponsePromise) {
  // server API always return JSON, in case of error the format is the following { error: <message> }
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {
          // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
          response
            .json()
            .then((json) => resolve(json))
            .catch((err) => reject({ error: "Cannot parse server response : " + err }));
        } else {
          if (response.status === 401) {
            reject({ error: "Unauthorized" });
          }
          if (response.status === 403) {
            reject({ error: "Forbidden" });
          }
          if (response.status === 500) {
            reject({ error: "Server Error" });
          }
          if (response.status === 404) {
          response
            .json()
            .then((obj) => reject(obj)) // error msg in the response body
            .catch((err) => reject({ error: "Cannot parse server response : " + err })); // something else
          }
        }
      })
      .catch((err) => reject({ error: "Cannot communicate : " + err })); // connection error
  });
}

/**
 * Getting from the server side and returning the list of pages.
 * The list of pages could be filtered in the server-side through the optional parameter: filter.
 */
const getPages = async (isAuthenticated) => {
  const reqObj = {method: 'GET',credentials: 'include'};
  // page.watchDate could be null or a string in the format YYYY-MM-DD
  return getJson(
    isAuthenticated
      ? fetch(URL + "/pages" ,reqObj)
      : fetch(URL + "/front/pages",reqObj)
  ).then((json) => {
    return json.map((page) => mapToPage(page));
  });
};

const getPage = async (idPage,isAuthenticated) => {
  const reqObj = {method: 'GET',credentials: 'include'};
  // page.watchDate could be null or a string in the format YYYY-MM-DD
  return getJson(
    isAuthenticated
      ? fetch(URL + "/pages/" + idPage ,reqObj)
      : fetch(URL + "/front/pages/" + idPage,reqObj)
  ).then((json) => {
    return mapToPage(json);
  });
};

/**
 * 
 * @param {Object} page 
 * @returns Promise<Object> the id of the page created
 */
function addPage(page) {
  // call  POST /api/answers
  return new Promise((resolve, reject) => {
    fetch(URL+`/pages`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.assign({}, mapFromPage(page))),
    }).then((response) => {
      if (response.ok) {
        response.json()
          .then((id) => resolve(id))
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

function updatePage(page) {
  // call  PUT /api/pages/:id
  return new Promise((resolve, reject) => {
    fetch(URL+`/pages/${page.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.assign({}, mapFromPage(page))),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

function deletePage(page) {
  // call  DELETE /api/pages/:id
  return new Promise((resolve, reject) => {
    fetch(URL+`/pages/${page}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (response.ok) {
        response.json()
          .then((numChanges) => resolve(numChanges))
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

async function logIn(credentials) {
  let response = await fetch(URL + '/sessions', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

async function logOut() {
  await fetch(URL+'/sessions/current', {
    method: 'DELETE', 
    credentials: 'include' 
  });
}

async function getUserInfo() {
  const response = await fetch(URL+'/sessions/current', {
    credentials: 'include'
  });
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server
  }
}

async function getUsers(){
  const response = await fetch(URL+'/users', {
    credentials: 'include'
  });
  const users = await response.json();
  if (response.ok) {
    return users;
  } else {
    throw users;  // an object with the error coming from the server
  }
}

async function getImages(){
  const response = await fetch(URL+'/images', {
    credentials: 'include'
  });
  const images = await response.json();
  if (response.ok) {
    return images;
  } else {
    throw images;  // an object with the error coming from the server
  }
}

async function getNameSite(){
  const response = await fetch(URL+'/front/name', {
    credentials: 'include'
  });
  const nameSite = await response.json();
  if (response.ok) {
    return nameSite;
  } else {
    throw nameSite;  // an object with the error coming from the server
  }
}

async function updateNameSite(name){
  const response = await fetch(URL+'/namesite', {
    method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"name" : name}),
  });
  const nameSite = await response.json();
  if (response.ok) {
    return nameSite;
  } else {
    throw nameSite;  // an object with the error coming from the server
  }
}

const API = {getPages , getPage , addPage , updatePage , deletePage , getUserInfo , logIn , logOut , getUsers , getImages , getNameSite , updateNameSite};
export default API;