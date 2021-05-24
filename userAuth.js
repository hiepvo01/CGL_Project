async function userCheck() {
    if(localStorage.getItem('access_token')) {
        try {
            let result = await fetch('https://vohi0311.pythonanywhere.com/financial/15_19', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
                }
            }).then((response) => {
                return response.json()
            })
            if (result["msg"] == "Token has expired") {
                alert("Session time out, please log in again")
                return false
            } else {
                console.log("Token accepted") 
                return true;
            }
        } catch (e) {
            return false
        }
    } else {
        alert("You need to login to see this content")
        return false
    }
}