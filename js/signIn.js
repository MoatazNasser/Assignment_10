var Iemail = document.getElementById("email");
var Ipassword = document.getElementById("password");

var btnLogin = document.getElementById("btnLogin");

var msg2 = document.getElementById("msg2");

var currentIP = "";
var currentUserindex;
var userArr = [];
var attemptsArr = [];

if (JSON.parse(localStorage.getItem("signup")) != null) {
  userArr = JSON.parse(localStorage.getItem("signup"));
}
if (JSON.parse(localStorage.getItem("loginAttempt")) != null) {
  attemptsArr = JSON.parse(localStorage.getItem("loginAttempt"));
}

getIPs().then(function (res) {
  alert(res.length);
  if (res.length == 1) {
    ipResult = JSON.stringify(res[0]);
    ipResult = ipResult.slice(1, ipResult.length - 1);
    alert(ipResult);
  } else {
    ipResult = JSON.stringify(res[0]) + ',"111111"';
    ipResult = ipResult.split(",");
    ipResult = ipResult[0];
    ipResult = ipResult.slice(1, ipResult.length - 1);
    alert(ipResult);
  }
  // ipResult = JSON.stringify(res[0]);
  // console.log(ipResult);
  // ipResult = ipResult.split(",");
  // ipResult = ipResult[0];
  // console.log(ipResult);
  // ipResult = ipResult.slice(1, ipResult.length - 1);
  // return ipResult;
  // console.log(ipResult);

  //first function reset time and number of attepts for user
  resetSuspend();
  setInterval(function () {
    resetSuspend();
  }, 5000);
  runpage(ipResult);
});

function runpage(ipResult) {
  currentIP = ipResult;
  // console.log(currentIP);
  btnLogin.onclick = function () {
    msg2.innerText = "";
    // check if IP suspended by checking time

    if (getTime() > checkSuspend(currentIP) || checkSuspend(currentIP) == -1) {
      if (Iemail.value == "" || Ipassword.value == "") {
        msg2.innerText = "Fill all the inputs first";
        // console.log(currentIP);
      } else {
        if (checkvalidation()) {
          //from here: start saving login data
          userArr[currentUserindex].userIP = currentIP;
          userArr[currentUserindex].loginStatus = true;
          resetSuspendNow(currentIP);
          localStorage.setItem("signup", JSON.stringify(userArr));
          window.location.assign("home.html");
          // alert("Success");
        } else {
          msg2.innerHTML = `your email or password is incorrect<br>
          <b> Note:</b> You have 5 Attempts every 15 Minutes`;
          addattempt(currentIP);
          checkAttempts(currentIP);
        }
      }
    }
    // else show the case if the user suspended
    else {
      console.log("HHHHHHHHHHHH");
      msg2.innerHTML = `You have attempted to login too many times<br> in a short period.
      please try again after <b class="text-warning">${calcRemainingTime(
        currentIP
      )}</b>`;
    }
  };

  Iemail.onfocus = function () {
    msg2.innerText = "";
  };
  Ipassword.onfocus = function () {
    msg2.innerText = "";
  };
}

function checkvalidation() {
  for (var i = 0; i < userArr.length; i++) {
    if (
      userArr[i].email == Iemail.value &&
      userArr[i].password == Ipassword.value
    ) {
      currentUserindex = i;
      return true;
    }
  }
  return false;
}

var userAttemptsIndex;
function checkAttempts(currentIP) {
  for (var i = 0; i < attemptsArr.length; i++) {
    if (attemptsArr[i].userIPAttempt == currentIP) {
      console.log("iam here ");
      attemptsArr[i].count += 1;
      userAttemptsIndex = i;
      if (attemptsArr[i].count >= 5) {
        attemptsArr[i].susTime = getSuspedTime();
        msg2.innerHTML = `You have attempted to login too many times<br> in a short period. please try again after <b class="text-warning">15 Minutes.</b>`;
      }
      localStorage.setItem("loginAttempt", JSON.stringify(attemptsArr));
    }
  }
  // console.log(userAttemptsIndex);
}

function addattempt(currentIP) {
  for (var i = 0; i < attemptsArr.length; i++) {
    if (currentIP == attemptsArr[i].userIPAttempt) {
      // console.log("already exist");
      return;
    }
  }
  var newAttempt = {
    userIPAttempt: currentIP,
    count: 0,
    susTime: 0,
  };
  attemptsArr.push(newAttempt);

  localStorage.setItem("loginAttempt", JSON.stringify(attemptsArr));
}
function resetSuspend() {
  for (var i = 0; i < attemptsArr.length; i++) {
    if (getTime() > attemptsArr[i].susTime && attemptsArr[i].count == 5) {
      attemptsArr[i].count = 0;
      attemptsArr[i].susTime = 0;
      localStorage.setItem("loginAttempt", JSON.stringify(attemptsArr));
    }
  }
  console.log("resetdone");
}

function resetSuspendNow(currentIP) {
  for (var i = 0; i < attemptsArr.length; i++) {
    if (attemptsArr[i].userIPAttempt == currentIP) {
      attemptsArr[i].count = 0;
      attemptsArr[i].susTime = 0;
      localStorage.setItem("loginAttempt", JSON.stringify(attemptsArr));
    }
  }
  console.log("resetdone");
}

function getSuspedTime() {
  var date = new Date().getTime();
  suspendTime = date + 30000;
  return suspendTime;
}

function getTime() {
  var time = new Date().getTime();
  return time;
}
function checkSuspend(currentIP) {
  for (var i = 0; i < attemptsArr.length; i++) {
    if (currentIP == attemptsArr[i].userIPAttempt) {
      return attemptsArr[i].susTime;
    }
  }
  return -1;
}

function calcRemainingTime(currentIP) {
  var result = checkSuspend(currentIP) - new Date().getTime();

  var minutes = Math.floor((result % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((result % (1000 * 60)) / 1000);

  // Output the result in an element with id="demo"
  var textt = minutes + "m " + seconds + "s ";
  return textt;
}

// var date = new Date().getTime();

// setInterval(function () {
//   var after30 = date + 900000;
//   var ress = after30 - new Date().getTime();

//   var minutes = Math.floor((ress % (1000 * 60 * 60)) / (1000 * 60));
//   var seconds = Math.floor((ress % (1000 * 60)) / 1000);

//   // Output the result in an element with id="demo"
//   console.log(minutes + "m " + seconds + "s ");
// }, 1000);
