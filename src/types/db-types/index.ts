export type TodoAttributes= {
    id: number;
    userId: number;
    task: string;
    completed: boolean;
    user_id_FK: number;
    taskImage: string | null;
    expectedTime: Date;
}
export type  UserAttributes= {
    id: number;
    username: string;
    password: string;
    verified: boolean;
}