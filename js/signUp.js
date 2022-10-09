var Iname = document.getElementById("name");
var Iemail = document.getElementById("email");
var Ipassword = document.getElementById("password");

var inputs = document.getElementsByClassName("inputs");

var alert1 = document.getElementById("alert1");
var alert2 = document.getElementById("alert2");
var alert3 = document.getElementById("alert3");

var btnSignup = document.getElementById("btnSignup");
var btnLogin = document.getElementById("btnLogin");
var btnSuccess = document.getElementById("btnSuccess");

var msg1 = document.getElementById("msg1");

nameReg = /^[A-Z].{2,30}$/;
emailReg =
  /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
passwordReg = /^.{5,15}$/;

userArr = [];

if (JSON.parse(localStorage.getItem("signup")) != null) {
  userArr = JSON.parse(localStorage.getItem("signup"));
}

Iname.onkeyup = function () {
  //to remove any message
  msg1.innerText = "";

  if (nameReg.test(Iname.value)) {
    alert1.classList.add("d-none");
    Iname.classList.remove("is-invalid");
    Iname.classList.add("is-valid");
  } else {
    alert1.classList.remove("d-none");
    Iname.classList.add("is-valid");
    Iname.classList.add("is-invalid");
  }
};

Iemail.onkeyup = function () {
  //to remove any message
  msg1.innerText = "";

  if (emailReg.test(Iemail.value)) {
    alert2.classList.add("d-none");
    Iemail.classList.remove("is-invalid");
    Iemail.classList.add("is-valid");
  } else {
    alert2.classList.remove("d-none");
    Iemail.classList.add("is-valid");
    Iemail.classList.add("is-invalid");
  }
};

Ipassword.onkeyup = function () {
  //to remove any message
  msg1.innerText = "";

  if (passwordReg.test(Ipassword.value)) {
    alert3.classList.add("d-none");
    Ipassword.classList.remove("is-invalid");
    Ipassword.classList.add("is-valid");
  } else {
    alert3.classList.remove("d-none");
    Ipassword.classList.add("is-valid");
    Ipassword.classList.add("is-invalid");
  }
};

btnSignup.onclick = function () {
  if (
    nameReg.test(Iname.value) &&
    emailReg.test(Iemail.value) &&
    passwordReg.test(Ipassword.value)
  ) {
    if (checkemail()) {
      adduser();
      msg1.classList.remove("text-danger");
      msg1.classList.add("text-success");
      msg1.innerText = "Success";

      btnSuccess.removeAttribute("disabled");
      btnSuccess.classList.remove("opacity-0");
      btnSuccess.classList.remove("opacity-100");
      resetFields();
    } else {
      msg1.classList.remove("text-success");
      msg1.classList.add("text-danger");
      msg1.innerText = `This account is exist ! Try another one.
      SignUp failed ! Try again`;
      clearInputs();
    }

    // alert("ffffffffffff");
  } else {
    msg1.classList.remove("text-success");
    msg1.classList.add("text-danger");
    msg1.innerText = "SignUp failed ! Try again";

    alert1.classList.remove("d-none");
    Iname.classList.add("is-invalid");

    alert2.classList.remove("d-none");
    Iemail.classList.add("is-invalid");

    alert3.classList.remove("d-none");
    Ipassword.classList.add("is-invalid");
  }
};

function adduser() {
  var user = {
    name: Iname.value,
    email: Iemail.value,
    password: Ipassword.value,
  };

  userArr.push(user);
  localStorage.setItem("signup", JSON.stringify(userArr));
}

function checkemail() {
  if (userArr.length == 0) {
    return true;
  } else {
    for (var i = 0; i < userArr.length; i++) {
      if (Iemail.value == userArr[i].email) return false;
    }
    return true;
  }
}
function resetFields() {
  alert1.classList.add("d-none");
  alert2.classList.add("d-none");
  alert3.classList.add("d-none");
  Iname.classList.remove("is-invalid");
  Iemail.classList.remove("is-invalid");
  Ipassword.classList.remove("is-invalid");
  Iname.classList.remove("is-valid");
  Iemail.classList.remove("is-valid");
  Ipassword.classList.remove("is-valid");
  clearInputs();
}
function clearInputs() {
  inputs[0].value = "";
  inputs[1].value = "";
  inputs[2].value = "";
}

// getIPs().then((res) => document.write(res));

getIPs().then((res) => {
  
var result = JSON.stringify(res[0]) ;
  alert(result);
//   result = result.split(",");
//   result = result[0];
  alert(result);
  result = result.slice(1, result.length - 1);
  alert(result);

  console.log(result.length);
});
