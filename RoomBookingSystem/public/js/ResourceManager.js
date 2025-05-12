function changePage(page) {
    window.location.href = page;
}

function notAdmin(userRole) {
    return userRole !== 'admin' && userRole !== 'systemAdmin';
}

function getUserId(exitingToken = null) {
    const token = exitingToken ?? getToken();
    return JSON.parse(atob(token.split('.')[1])).sub;
}

function getToken() {
    return localStorage.getItem('authToken');
}

function getMethodAndHeaders(method, body) {
    return {
        method: method,
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            ...(body != null && { 'Content-Type': 'application/json' }),
            'Accept': 'application/json'
        },
        // If body is not null it adds the body
        ...(body != null && { body: JSON.stringify(body) })
    }
}

function Get(path, onSuccess) {
    fetch(path, getMethodAndHeaders('GET'))
        .then(async response => {
            const data = await response.json().catch(() => {});
            if (!response.ok) {
                alert(data.message || `Request failed with status ${response.status}`);
                console.error(data.message || `Request failed with status ${response.status}`);
                return;
            }
            await onSuccess(data)
        })
        .catch(error => alert('Something went wrong: ', error));
}

function Post(path, data, onSuccess) {
    fetch(path, getMethodAndHeaders('POST', data))
        .then(async response => {
            const data = await response.json().catch(() => {});
            if (!response.ok) {
                alert(data.message || `Request failed with status ${response.status}`);
                console.error(data.message || `Request failed with status ${response.status}`);
                return;
            }

            await onSuccess(data);
        })
        .catch(error => alert('Something went wrong: ', error.message));
}

function Put(path, data, onSuccess) {
    fetch(path, getMethodAndHeaders('PUT', data))
        .then(async response => {
            const data = await response.json().catch(() => {});
            if (!response.ok) {
                alert(data.message || `Request failed with status ${response.status}`);
                console.error(data.message || `Request failed with status ${response.status}`);
                return;
            }

            await onSuccess(data);
        })
        .catch(error => alert('Something went wrong: ', error.message));
}

function Delete(path, onSuccess) {
    fetch(path, getMethodAndHeaders('DELETE'))
        .then(async response => {
            const data = await response.json().catch(() => {});
            if (!response.ok) {
                alert(data.message || `Request failed with status ${response.status}`);
                console.error(data.message || `Request failed with status ${response.status}`);
                return;
            }

            await onSuccess(data);
        })
        .catch(error => alert('Something went wrong: ', error.message));
}
