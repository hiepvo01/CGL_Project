function userCheck() {
    if(localStorage.getItem('access_token')) {
        try {
            fetch('https://vohi0311.pythonanywhere.com/financial/15_16', {
            headers: {
                Authorization: `token ${localStorage.getItem('access_token')}`
                }
            }) 
            return true;
        } catch (e) {
            alert("Session time out, please log in again")
            return false
        }
    } else {
        alert("You need to login to see this content")
        return false
    }
}