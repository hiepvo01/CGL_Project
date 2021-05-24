async function userCheck() {
    if(localStorage.getItem('access_token')) {
        try {
            await fetch('https://vohi0311.pythonanywhere.com/allData', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
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