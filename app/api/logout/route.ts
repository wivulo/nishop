import { NextApiRequest, NextApiResponse } from 'next';
// import { cookies } from 'next/headers';

export async function logout(req: NextApiRequest, res: NextApiResponse){
    // Delete the user cookie
    res.setHeader('Set-Cookie', 'userToken=; Max-Age=0; Path=/');
    //cookies().delete("user");

    // Return a success response
    res.status(200).json({ message: 'User logged out successfully' });
};
