var Iemail = document.getElementById("email");
var Ipassword = document.getElementById("password");

var btnLogin = document.getElementById("btnLogin");

var msg2 = document.getElementById("msg2");

var currentIP = "";
var currentUserindex;
var userArr = [];
var attemptsArr = [];

// to retrive data from localstorage
if (JSON.parse(localStorage.getItem("signup")) != null) {
  userArr = JSON.parse(localStorage.getItem("signup"));
}
// to retrive user attempts to login from localstorage

if (JSON.parse(localStorage.getItem("loginAttempt")) != null) {
  attemptsArr = JSON.parse(localStorage.getItem("loginAttempt"));
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

  //first function reset time and number of attempts for user onload
  resetSuspend();

  // check every 5 sec if susp. timeout to reset attempts counter
  setInterval(function () {
    resetSuspend();
  }, 5000);

  // to be sure we get IP first before continue
  runpage(ipResult);
});

function runpage(ipResult) {
  currentIP = ipResult;
  // console.log(currentIP);

  // four cases : 1- the user is suspended because of 5 attempts to login
  // 2- the user doesn't enter any data
  // 3 - the user enters wrong data
  // 4- the user enters correct data
  btnLogin.onclick = function () {
    msg2.innerText = "";
    // check if IP is suspended by checking diff between susp. time and current time
    if (getTime() > checkSuspend(currentIP) || checkSuspend(currentIP) == -1) {
      // if on or more fields are empty
      if (Iemail.value == "" || Ipassword.value == "") {
        msg2.innerText = "Fill all the inputs first";
        // console.log(currentIP);
      } else {
        //check validation
        if (checkvalidation()) {
          //from here: start saving login data
          userArr[currentUserindex].userIP = currentIP;
          // important step to prevent users from using home page without login
          userArr[currentUserindex].loginStatus = true;
          resetSuspendNow(currentIP);
          localStorage.setItem("signup", JSON.stringify(userArr));
          window.location.assign("home.html");
        } else {
          msg2.innerHTML = `your email or password is incorrect<br>
          <b> Note:</b> You have 5 Attempts every <b class="text-warning">30 Seconds.</b>`;
          addattempt(currentIP);
          checkAttempts(currentIP);
        }
      }
    }
    // else here to show the case if the user is suspended
    else {
      // console.log("test");
      msg2.innerHTML = `You have attempted to login too many times<br> in a short period.
      please try again after <b class="text-warning">${calcRemainingTime(
        currentIP
      )}</b>`;
    }
  };

  // to remove any previous message onfocuse
  Iemail.onfocus = function () {
    msg2.innerText = "";
  };

  // to remove any previous message onfocuse
  Ipassword.onfocus = function () {
    msg2.innerText = "";
  };
}

// to search for user in stored data
function checkvalidation() {
  for (var i = 0; i < userArr.length; i++) {
    if (
      userArr[i].email == Iemail.value &&
      userArr[i].password == Ipassword.value
    ) {
      // to get user's index in global var
      currentUserindex = i;
      return true;
    }
  }
  return false;
}

// to check number of attempts by the same ip address and count it
var userAttemptsIndex;
function checkAttempts(currentIP) {
  for (var i = 0; i < attemptsArr.length; i++) {
    if (attemptsArr[i].userIPAttempt == currentIP) {
      // console.log("iam here ");
      attemptsArr[i].count += 1;
      userAttemptsIndex = i;

      // every try increase counter by 1 then save the currenttime+ suspend time in local storage
      if (attemptsArr[i].count == 5) {
        attemptsArr[i].susTime = setSuspedTime();
        msg2.innerHTML = `You have attempted to login too many times<br> in a short period. please try again after <b class="text-warning">30 Seconds.</b>`;
      }
      localStorage.setItem("loginAttempt", JSON.stringify(attemptsArr));
    }
  }
}

// to add user attempts to localstorage (attemptsArray)
function addattempt(currentIP) {
  for (var i = 0; i < attemptsArr.length; i++) {
    if (currentIP == attemptsArr[i].userIPAttempt) {
      // console.log("already exist");
      // if we stored the user return
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

// to reset counter and suspendTime (susTime var inside newAttempt object)
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

// when the user login successfully reset counter and time
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

// set suspend time (here 30 Seconds only for test)
function setSuspedTime() {
  var date = new Date().getTime();
  suspendTime = date + 30000;
  return suspendTime;
}

// get current time
function getTime() {
  var time = new Date().getTime();
  return time;
}

// get suspend time + if the user not suspended
function checkSuspend(currentIP) {
  for (var i = 0; i < attemptsArr.length; i++) {
    if (currentIP == attemptsArr[i].userIPAttempt) {
      return attemptsArr[i].susTime;
    }
  }
  return -1;
}

// calc remaining time to show it to user every refresh
function calcRemainingTime(currentIP) {
  var result = checkSuspend(currentIP) - new Date().getTime();

  var minutes = Math.floor((result % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((result % (1000 * 60)) / 1000);

  // Output the result in an element with id="demo"
  var textt = minutes + "m " + seconds + "s ";
  return textt;
}

//test
// var date = new Date().getTime();

// setInterval(function () {
//   var after30 = date + 900000;
//   var ress = after30 - new Date().getTime();

//   var minutes = Math.floor((ress % (1000 * 60 * 60)) / (1000 * 60));
//   var seconds = Math.floor((ress % (1000 * 60)) / 1000);

//   // Output the result in an element with id="demo"
//   console.log(minutes + "m " + seconds + "s ");
// }, 1000);
