import { cookies } from 'next/headers';
import { NextResponse } from 'next/server'

export async function GET(req: Request, res: Response){
    cookies().delete("user");
    return NextResponse.json({message: 'user logout successfully', status: true });
};
