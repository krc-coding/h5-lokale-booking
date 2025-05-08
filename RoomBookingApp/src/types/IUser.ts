export interface IUser {
    id: number,
    username: string,
    role: "teacher" | "admin" | "systemAdmin",
    created_at: string,
    updated_at: string,
    disabled: number;
}
