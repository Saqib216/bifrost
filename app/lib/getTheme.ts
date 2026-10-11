import {cookies} from 'next/headers'

export async function getTheme(): Promise<'dark'|'light'> {
    const stored = (await cookies()).get("theme")?.value;
    return stored === 'light' ? 'light' : 'dark';
}