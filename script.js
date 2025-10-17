let inviteKey = "redskullz2025"; // Change this to your secret invite code
let username = "";
let chatBox = document.getElementById("chatBox");

// Wait until everything loads
window.onload = function() {
  document.getElementById("joinBtn").addEventListener("click", joinChat);
  document.getElementById("sendBtn").addEventListener("click", sendMessage);
  document.getElementById("ocBtn").addEventListener("click", toggleOCPanel);
  document.getElementById("addOCBtn").addEventListener("click", addOC);
};

// Join chat
function joinChat() {
  let name = document.getElementById("username").value.trim();
  let code = document.getElementById("invite").value.trim();
  let error = document.getElementById("error");

  if (!name) {
    error.textContent = "Please enter your name.";
    return;
  }
  if (code !== inviteKey) {
    error.textContent = "Wrong invite code.";
    return;
  }

  username = name;
  document.getElementById("login").style.display = "none";
  document.getElementById("chat").style.display = "block";
}

// Send message
function sendMessage() {
  let msg = document.getElementById("msg").value.trim();
  if (!msg) return;

  let msgDiv = document.createElement("div");
  msgDiv.classList.add("message");
  msgDiv.innerHTML = `<b>${username}:</b> ${msg}`;
  chatBox.appendChild(msgDiv);

  document.getElementById("msg").value = "";
  document.getElementById("ding").play();
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Toggle OC panel
function toggleOCPanel() {
  const ocPanel = document.getElementById("ocPanel");
  ocPanel.style.display = ocPanel.style.display === "none" ? "block" : "none";
}

// Add OC
function addOC() {
  let name = document.getElementById("ocName").value.trim();
  let desc = document.getElementById("ocDesc").value.trim();
  let image = document.getElementById("ocImage").files[0];
  let ocList = document.getElementById("ocList");

  if (!name || !desc) return alert("Please fill in all OC fields.");

  let div = document.createElement("div");
  div.classList.add("oc-card");
  div.innerHTML = `<h4>${name}</h4><p>${desc}</p>`;
  if (image) {
    let imgURL = URL.createObjectURL(image);
    div.innerHTML += `<img src="${imgURL}" class="chat-img">`;
  }

  ocList.appendChild(div);
  document.getElementById("ocName").value = "";
  document.getElementById("ocDesc").value = "";
  document.getElementById("ocImage").value = "";
}
