export interface User {
    id: number;
    name: string;
    email: string;
    company: { name: string };
    address: { city: string };
}

export interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
}

export interface CatFact {
    fact: string;
    length: number;
}