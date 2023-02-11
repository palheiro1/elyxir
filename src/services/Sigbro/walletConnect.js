export const createConexion = async uuid => {
    const response = await fetch(`https://random.api.nxter.org/api/auth/new`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            uuid,
        }),
    });
    const data = await response.json();
    return data;
};

export const checkConexion = async uuid => {
    const response = await fetch(`https://random.api.nxter.org/api/auth/status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            uuid,
        }),
    });
    const data = await response.json();
    return data;
}

export const checkIfIsValid = async (uuid, token) => {
    const response = await fetch(`https://random.api.nxter.org/ardor?requestType=decodeToken&website=${uuid}&token=${token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const data = await response.json();
    return data;
}