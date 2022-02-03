async function logout() {
    
    //-- request logout from controllers routing, if succesful send to homepage
    const response = await fetch('/api/users/logout', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' }
    });
    //-- path to root if success request
    if (response.ok) {
        document.location.replace('/');
    } else {
        alert(response.statusText);
    }
}

//-- add script to button with ID logout
document.querySelector('#logout').addEventListener('click', logout);
