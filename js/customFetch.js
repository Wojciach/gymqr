export function customFetch(requestBody = null) {

    const requestType = Object.keys(requestBody)[0];
    if(localStorage.getItem('token') === null && requestType !== 'checkCredentials' ) {
        window.location.href = 'login.html';
        return;
    }

   const myFetch = fetch('./php/endpoint.php', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            // 'Cache-Control': 'no-cache',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })

    return myFetch;
}