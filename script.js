// Firebase setup
const db = firebase.database();
const storage = firebase.storage();

let currentUser = null;
const maxImages = 10;

// DOM elements
const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const usernameInput = document.getElementById('username');
const nameError = document.getElementById('name-error');
const chatBox = document.getElementById('chatBox');
const msgInput = document.getElementById('msg');
const imgInput = document.getElementById('imgInput');
const dingSound = document.getElementById('ding');

const ocSection = document.getElementById('oc-section');
const ocName = document.getElementById('ocName');
const ocDesc = document.getElementById('ocDesc');
const ocImage = document.getElementById('ocImage');
const ocMsg = document.getElementById('ocMsg');
const ocPopup = document.getElementById('oc-popup');
const ocPopupContent = document.getElementById('oc-popup-content');

// ---- LOGIN ----
function login() {
  const name = usernameInput.value.trim();
  if (name === "") {
    nameError.textContent = "Please enter a name.";
    return;
  }

  db.ref('users').once('value', snapshot => {
    let exists = false;
    snapshot.forEach(child => {
      if (child.val().name.toLowerCase() === name.toLowerCase()) {
        exists = true;
      }
    });

    if (exists) {
      nameError.textContent = "That name is already taken!";
    } else {
      currentUser = name;
      db.ref('users').push({ name: currentUser });
      loginScreen.style.display = 'none';
      chatScreen.style.display = 'block';
      ocSection.style.display = 'block';
      loadMessages();
    }
  });
}

// ---- SEND MESSAGE ----
function sendMessage() {
  if (!currentUser) return alert("Please enter a name first!");
  const text = msgInput.value.trim();
  const files = imgInput.files;

  if (text === "" && files.length === 0) return;

  const messageData = {
    name: currentUser,
    text: text,
    time: Date.now(),
    images: []
  };

  if (files.length > 0) {
    if (files.length > maxImages) {
      alert(`You can only send up to ${maxImages} images!`);
      return;
    }

    let uploadPromises = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileRef = storage.ref(`images/${Date.now()}_${file.name}`);
      const uploadTask = fileRef.put(file).then(snapshot => snapshot.ref.getDownloadURL());
      uploadPromises.push(uploadTask);
    }

    Promise.all(uploadPromises).then(urls => {
      messageData.images = urls;
      db.ref('messages').push(messageData);
      msgInput.value = "";
      imgInput.value = "";
    });
  } else {
    db.ref('messages').push(messageData);
    msgInput.value = "";
  }
}

// ---- LOAD MESSAGES ----
function loadMessages() {
  db.ref('messages').on('child_added', snapshot => {
    const msg = snapshot.val();
    displayMessage(msg);
  });
}

function displayMessage(msg) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message');

  let html = `<strong class="clickable-name" data-user="${msg.name}" style="color:#ff5555;cursor:pointer;">${msg.name}</strong>: ${msg.text || ''}<br>`;

  if (msg.images && msg.images.length > 0) {
    msg.images.forEach(url => {
      html += `<img src="${url}" style="max-width:150px; margin:5px;">`;
    });
  }

  msgDiv.innerHTML = html;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (msg.name !== currentUser) {
    dingSound.play();
  }

  msgDiv.querySelector('.clickable-name').addEventListener('click', e => {
    const user = e.target.getAttribute('data-user');
    showOC(user);
  });
}

// ---- OC SYSTEM ----
function saveOC() {
  if (!currentUser) return alert("Please log in first!");
  const name = ocName.value.trim();
  const desc = ocDesc.value.trim();
  const imageFile = ocImage.files[0];

  if (name === "" || desc === "") {}
}

function saveOCData(name, desc, imgUrl) {
  db.ref(`ocs/${currentUser}`).set({
    name: name,
    desc: desc,
    image: imgUrl
  }).then(() => {
    ocMsg.textContent = "✅ OC saved!";
  });
}

function showOC(user) {
  db.ref(`ocs/${user}`).once('value', snapshot => {
    const oc = snapshot.val();
    if (!oc) {
      ocPopupContent.innerHTML = `<p>${user} has not added an OC yet.</p>`;
    } else {
      let html = `<h3>${oc.name}</h3><p>${oc.desc}</p>`;
      if (oc.image) html += `<img src="${oc.image}" style="max-width:200px; border-radius:10px;">`;
      ocPopupContent.innerHTML = html;
    }
    ocPopup.style.display = 'block';
  });
}

function closeOCPopup() {
  ocPopup.style.display = 'none';
}

// ---- CALL PLACEHOLDER ----
function startCall() {
  alert("Voice call feature coming soon!");
}
