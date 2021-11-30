const promptPassword = () => {
  const body = document.getElementsByTagName('body')[0]
  password = prompt('Password:')
  if(password === "fish") {
    body.hidden = false;
  } else {
    body.innerHTML = "Unauthorized"
    body.hidden = false;
  }
}