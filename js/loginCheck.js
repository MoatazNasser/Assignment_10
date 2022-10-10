var currentIP = "";
var currentUserindex;
var userArr = [];

var content = document.getElementById("content");
var btnLogout = document.getElementById("btnLogout");

// to retrive data from localstorage
if (JSON.parse(localStorage.getItem("signup")) != null) {
  userArr = JSON.parse(localStorage.getItem("signup"));
}

//to get user's ip (to check his status )
getIPs().then(function (res) {
  console.log(res.length);
  if (res.length == 1) {
    ipResult = JSON.stringify(res[0]);
    ipResult = ipResult.slice(1, ipResult.length - 1);
    console.log(ipResult);
  } else {
    ipResult = JSON.stringify(res[0]);
    ipResult = ipResult.split(",");
    ipResult = ipResult[0];
    ipResult = ipResult.slice(1, ipResult.length - 1);
    console.log(ipResult);
  }
  // prevent sync function before getting ip
  runpage(ipResult);
});

function runpage(ipResult) {
  currentIP = ipResult;

  // to keep user in page or redirect him to login page
  checkUser(currentIP);

  // change login status to false to prevent unauthentic users from landing direct on home page
  btnLogout.onclick = function () {
    // console.log(currentUserindex);
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

// search for the user and check his ip and status (status changes when  we click on login & logout btns only)
function checkUser(ip) {
  // we found him and return
  for (var i = 0; i < userArr.length; i++) {
    if (userArr[i].userIP == ip && userArr[i].loginStatus == true) {
      // get user current index in global var
      currentUserindex = i;
      content.innerHTML = `
        <h5 class="fw-semibold text-theme fs-1 p-3 animate__animated animate__backInDown">Welcome
        <span class="text-warning">${userArr[i].name}</span> </h5>
        `;
      return;
    }
  }
  // he tried to login direct by home.thml url so i redirect him after 3 sec
  content.innerHTML = `
        <h5 class="fw-semibold text-theme fs-1 p-3 animate__animated animate__backInDown">You Need to login first</h5>
        <h6 id="countDown" class="fw-semibold text-theme fs-1 p-3 animate__animated animate__fadeIn"></h6>
        `;
  // redirect after 3 Sec to login page
  var count = 3;
  setInterval(function () {
    count--;
    document.getElementById("countDown").innerHTML = count;
    if (count == 0) {
      window.location = "signin.html";
    }
  }, 1000);
}
