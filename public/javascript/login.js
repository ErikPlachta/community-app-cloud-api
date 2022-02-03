/* 
    We're going to be listening for the submit event from the form
*/
//-- basic event listner func
// function signupFormHandler(event) {
//     event.preventDefault();

// }

//-- Event listener with Fetch to API built in and proper fields pulled from form
// function signupFormHandler(event) {
//     event.preventDefault();
  
//     const username = document.querySelector('#username-signup').value.trim();
//     const email = document.querySelector('#email-signup').value.trim();
//     const password = document.querySelector('#password-signup').value.trim();
  
//     if (username && email && password) {
//       fetch('/api/users', {
//         method: 'post',
//         body: JSON.stringify({
//           username,
//           email,
//           password
//         }),
//         headers: { 'Content-Type': 'application/json' }
//       }).then((response) => {console.log(response)})
//     }
// }


//--ASYNC function used with to send form payload to API with ASYNC and Await
async function signupFormHandler(event) {
    event.preventDefault();
  
    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
  
    if (username && email && password) {
      const response = await fetch('/api/users', {
        method: 'post',
        body: JSON.stringify({
          username,
          email,
          password
        }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      // check the response status
      if (response.ok) {
        console.log('success');
      } else {
        alert(response.statusText);
      }
    }
  }
  
async function loginFormHandler(event) {
    event.preventDefault();

    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    if (email && password) {
        const response = await fetch('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            document.location.replace('/');
        }
         else {
            alert(response.statusText);
        }
    }
}
  
document.querySelector('.login-form').addEventListener('submit', loginFormHandler);    
document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
