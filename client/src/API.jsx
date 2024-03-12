import { mapFromPage, mapToPage } from "./Page";

const URL = import.meta.env.VITE_URL + "/api";
const LIMIT = import.meta.env.VITE_SIZE;

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
            reject({ error: "Not Found" });
          }
          else {
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
const getPosts = async (cat,platform,page,limit) => {
  const reqObj = {method: 'GET',credentials: 'include'};
  // page.watchDate could be null or a string in the format YYYY-MM-DD
  let postUrl = URL + "/posts/public";
  const pageUrl = page ? "page=" + page : "page=1";
  const limitUrl = "limit=" + (limit || LIMIT);
  console.log(LIMIT);
  if (cat){
    postUrl += "?cat=" + cat;
    postUrl += "&" + pageUrl + "&" + limitUrl;
  }
  else if (platform){
    postUrl += "?platform=" + platform;
    postUrl += "&" + pageUrl + "&" + limitUrl;
  }
  else{
    postUrl += "?" + pageUrl + "&" + limitUrl;
  }
  return getJson(fetch(postUrl,reqObj)
  ).then((json) => {
    return json;
  });
};

const getPost = async (idPost) => {
  const reqObj = {method: 'GET',credentials: 'include'};
  // page.watchDate could be null or a string in the format YYYY-MM-DD
  return getJson(fetch(URL + "/posts/public/" + idPost,reqObj)
  ).then((json) => {
    return json;
  }).catch((err) => {
    console.log(err);
  });
};

/**
 * 
 * @param {Object} post 
 * @returns Promise<Object> the id of the page created
 */
function createPost(post) {
  // call  POST /api/answers
  return new Promise((resolve, reject) => {
    fetch(URL+`/posts`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.assign({}, post)),
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

function updatePost(post) {
  // call  PUT /api/pages/:id
  return new Promise((resolve, reject) => {
    fetch(URL+`/posts/${post.id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Object.assign({}, post)),
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

function deletePost(post) {
  // call  DELETE /api/pages/:id
  return new Promise((resolve, reject) => {
    fetch(URL+`/posts/${post}`, {
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

function uploadImage(file) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    fetch(URL + '/upload', {
      method: 'POST',
      credentials: 'include',
      body: formData
    }).then((response) => {
      if (response.ok) {
        response.json()
          .then((filename) => resolve(filename))
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
  let response = await fetch(URL + '/auth/login', {
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
  await fetch(URL+'/auth/logout', {
    method: 'POST', 
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

async function getCategories(){
  const response = await fetch(URL+'/categories/reviews', {
    credentials: 'include'
  });
  const categories = await response.json();
  if (response.ok) {
    return categories;
  } else {
    throw categories;  // an object with the error coming from the server
  }
}

async function getPlatforms(){
  const response = await fetch(URL+'/categories/platforms', {
    credentials: 'include'
  });
  const platforms = await response.json();
  if (response.ok) {
    return platforms;
  } else {
    throw platforms;  // an object with the error coming from the server
  }
}

async function getNews(){
  const response = await fetch(URL+'/categories/news', {
    credentials: 'include'
  });
  const platforms = await response.json();
  if (response.ok) {
    return platforms;
  } else {
    throw platforms;  // an object with the error coming from the server
  }
}

async function getDrafts(uid){
  const response = await fetch(URL+'/posts/drafts/' + uid, {
    credentials: 'include'
  });
  const drafts = await response.json();
  if (response.ok) {
    return drafts;
  } else {
    throw drafts;  // an object with the error coming from the server
  }
}

async function registerUser(inputs){
  const response = await fetch(URL+'/auth/register', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(inputs),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  }
}

async function getPostsNumber(cat,platform){
  const reqObj = {method: 'GET',credentials: 'include'};
  let postUrl = URL + "/posts/number";
  if (cat){
    postUrl += "?cat=" + cat;
  }
  else if (platform){
    postUrl += "?platform=" + platform;
  }
  return getJson(fetch(postUrl,reqObj)
  ).then((json) => {
    return json;
  });

}

const API = {getPosts , getPost , createPost , updatePost , deletePost , getUserInfo , logIn , logOut , getUsers , getImages, uploadImage, getCategories, getPlatforms,getDrafts,registerUser,getPostsNumber,getNews};
export default API;