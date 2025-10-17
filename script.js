// === FIREBASE CONFIG ===
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const storage = firebase.storage();

let username = "";
let inviteKey = "redskullz2025"; // Change this to your secret invite code

function login() {
  const nameInput = document.getElementById("username").value.trim();
  const codeInput = document.getElementById("inviteCode").value.trim();
  const error = document.getElementById("error");

  if (!nameInput || !codeInput) {
    error.textContent = "Enter name and invite code.";
    return;
  }
  if (codeInput !== inviteKey) {
    error.textContent = "Invalid invite code.";
    return;
  }

  db.ref("users/" + nameInput).get().then(snapshot => {
    if (snapshot.exists()) {
      error.textContent = "That name is already taken.";
    } else {
      username = nameInput;
      db.ref("users/" + username).set(true);
      document.getElementById("login-screen").style.display = "none";
      document.getElementById("chat-screen").style.display = "block";
      listenForMessages();
    }
  });
}

function sendMessage() {
  const msg = document.getElementById("msg").value;
  const imgInput = document.getElementById("imgInput");
  if (!msg && imgInput.files.length === 0) return;

  const msgRef = db.ref("messages").push();
  msgRef.set({
    user: username,
    text: msg,
    time: Date.now()
  });

  // Upload up to 10 images
  Array.from(imgInput.files).slice(0, 10).forEach(file => {
    const imgRef = storage.ref("images/" + Date.now() + "_" + file.name);
    imgRef.put(file).then(() => {
      imgRef.getDownloadURL().then(url => {
        db.ref("messages").push({
          user: username,
          img: url,
          time: Date.now()
        });
      });
    });
  });

  document.getElementById("msg").value = "";
  imgInput.value = "";
}

function listenForMessages() {
  const chatBox = document.getElementById("chatBox");
  db.ref("messages").on("child_added", snapshot => {
    const data = snapshot.val();
    const msgDiv = document.createElement("div");
    msgDiv.className = "message";

    if (data.text) {
      msgDiv.innerHTML = `<span class='username'>${data.user}:</span> ${data.text}`;
    } else if (data.img) {
      msgDiv.innerHTML = `<span class='username'>${data.user}:</span><br><img src='${data.img}' class='chat-img' />`;
    }

    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    document.getElementById("ding").play();
  });
}

// === OC System ===
function showOCModal() {
  document.getElementById("ocModal").style.display = "block";
}

function closeOCModal() {
  document.getElementById("ocModal").style.display = "none";
}

function saveOC() {
  const name = document.getElementById("ocName").value;
  const desc = document.getElementById("ocDesc").value;
  const file = document.getElementById("ocImage").files[0];

  if (!name || !desc) return alert("Fill out all fields.");

  if (file) {
    const imgRef = storage.ref("ocImages/" + username + "_" + file.name);
    imgRef.put(file).then(() => {
      imgRef.getDownloadURL().then(url => {
        db.ref("ocs/" + username).set({ name, desc, img: url });
        alert("OC saved!");
        closeOCModal();
      });
    });
  } else {
    db.ref("ocs/" + username).set({ name, desc });
    alert("OC saved!");
    closeOCModal();
  }
}

function logout() {
  db.ref("users/" + username).remove();
  location.reload();
}
