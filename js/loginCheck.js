var currentIP = "";
var currentUserindex;
var userArr = [];

var content = document.getElementById("content");
var btnLogout = document.getElementById("btnLogout");

if (JSON.parse(localStorage.getItem("signup")) != null) {
  userArr = JSON.parse(localStorage.getItem("signup"));
}

getIPs().then(function (res) {
  // console.log(res);
  ipResult = JSON.stringify(res[0]);
  // console.log(ipResult);
  ipResult = ipResult.split(",");
  ipResult = ipResult[0];
  // console.log(ipResult);
  ipResult = ipResult.slice(1, ipResult.length - 1);
  // return ipResult;
  // console.log(ipResult);

  runpage(ipResult);
});

function runpage(ipResult) {
  currentIP = ipResult;
  console.log(currentIP);
  checkUser(currentIP);

  btnLogout.onclick = function () {
    console.log(currentUserindex);
    userArr[currentUserindex].loginStatus = false;
    userArr[currentUserindex].userIP = "";

    localStorage.setItem("signup", JSON.stringify(userArr));
    content.innerHTML = `
        <h5 class="fw-semibold text-theme fs-1 p-3 animate__animated animate__backInDown">Thank you
        <span class="text-warning"> ${userArr[currentUserindex].name}</span> <br>
        See you soon...</h5>
        `;
    setInterval(function () {
      window.location = "signin.html";
    }, 2000);
  };
}

function checkUser(ip) {
  for (var i = 0; i < userArr.length; i++) {
    if (userArr[i].userIP == ip && userArr[i].loginStatus == true) {
      currentUserindex = i;
      content.innerHTML = `
        <h5 class="fw-semibold text-theme fs-1 p-3 animate__animated animate__backInDown">Welcome
        <span class="text-warning">${userArr[i].name}</span> </h5>
        `;
      return;
    }
  }
  content.innerHTML = `
        <h5 class="fw-semibold text-theme fs-1 p-3 animate__animated animate__backInDown">You Need to login first</h5>
        <h6 id="countDown" class="fw-semibold text-theme fs-1 p-3 animate__animated animate__fadeIn"></h6>
        `;
  var count = 3;
  setInterval(function () {
    count--;
    document.getElementById("countDown").innerHTML = count;
    if (count == 0) {
      window.location = "signin.html";
    }
  }, 1000);
}
