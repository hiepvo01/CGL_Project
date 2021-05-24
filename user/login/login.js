async function Login(){
    email = document.getElementById('email').value
    password = document.getElementById('password').value

    let url = 'https://vohi0311.pythonanywhere.com/login'
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (document.getElementById('login-alert')) {
            let myobj = document.getElementById("login-alert");
            myobj.remove();
        }
        if (xhr.readyState == XMLHttpRequest.DONE) {
            alert = document.createElement('div')
            alert.classList.add('alert')
            alert.setAttribute('id', 'login-alert')
            if (JSON.parse(xhr.responseText).message == 'Login succeeded') {
                alert.classList.add('alert-success')
                localStorage.setItem('email', email)
                location.href="../../index.html"
            } else {
                alert.classList.add('alert-danger')
            }
            alert.innerHTML = JSON.parse(xhr.responseText).message
            form = document.getElementById('login-form')
            form.appendChild(alert)

            if (JSON.parse(xhr.responseText).message == 'Login succeeded') {
                localStorage.setItem('access_token', JSON.parse(xhr.responseText).access_token)
            }
        }
    }
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        email: email,
        password: password
    }));

    
}
