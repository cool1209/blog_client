type AuthenticatedUser = {
    token: string;
    expirationTime: number;
    role: string;
    userId: string;
};

export default AuthenticatedUser;
