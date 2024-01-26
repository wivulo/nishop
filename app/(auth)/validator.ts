export const registrationValidator = (data: FormData) => {
    const name = data.get("name");
    const email = data.get("email");
    const password = data.get("password");

    if(name && email && password) return true

    return false;
} 