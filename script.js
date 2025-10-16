// Firebase setup (temporary demo version)
const firebaseConfig = {
  apiKey: "AIzaSyDUMMY",
  authDomain: "example.firebaseapp.com",
  databaseURL: "https://example.firebaseio.com",
  projectId: "example",
  storageBucket: "example.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:example"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.database();
let currentUser = "";

// Login with name check
function login() {
  const name = document.getElementById("username").value.trim();
  const error = document.getElementById("name-error");

  if (!name) {
    error.textContent = "Please enter a name!";
    return;
  }

  // Check if name is taken
  db.ref("users/" + name).once("value", snap => {
    if (snap.exists()) {
      error.textContent = "That name is already taken!";
    } else {
      db.ref("users/" + name).set(true);
      currentUser = name;
      document.getElementById("login-screen").style.display = "none";
      document.getElementById("chat-screen").style.display = "block";
      listenForMessages();
    }
  });
}

// Send a message
function sendMessage() {
  const msgInput = document.getElementById("msg");
  const imgInput = document.getElementById("imgInput");
  const msg = msgInput.value.trim();
  const files = Array.from(imgInput.files);

  if (!msg && files.length === 0) return;
  if (files.length > 10) return alert("You can only send up to 10 images!");

  const data = { user: currentUser, text: msg, time: Date.now() };
  db.ref("messages").push(data);

  files.forEach(f => {
    const reader = new FileReader();
    reader.onload = e => {
      const imgData = { user: currentUser, image: e.target.result, time: Date.now() };
      db.ref("messages").push(imgData);
    };
    reader.readAsDataURL(f);
  });

  msgInput.value = "";
  imgInput.value = "";
}

// Listen for new messages
function listenForMessages() {
  const chat = document.getElementById("chatBox");
  const ding = document.getElementById("ding");

  db.ref("messages").on("child_added", snap => {
    const data = snap.val();
    const div = document.createElement("div");
    div.className = "message";

    if (data.text) div.innerHTML = `<strong>${data.user}:</strong> ${data.text}`;
    else if (data.image) div.innerHTML = `<strong>${data.user}:</strong><br><img src="${data.image}" style="max-width:100%;border-radius:6px;margin-top:5px;">`;

    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;

    if (data.user !== currentUser) ding.play();
  });
}

// Simple WebRTC voice call placeholder (real one comes next)
function startCall() {
  alert("Voice calling will be added next!");
}
