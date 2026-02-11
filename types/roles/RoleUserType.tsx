export interface UserRoles {
    created_at: string;
    id: number;
    pivot: { user_id: number; role_id: number; active: boolean; created_at: string; updated_at: string, read: boolean };
    title: string;
    updated_at: string
}

export interface RoleUserType {
    created_at: string;
    email: string;
    father_name: string;
    id: number;
    is_student: false;
    is_working: true;
    last_name: string;
    myedu_id: number;
    name: string;
    roles: UserRoles[];
    updated_at: string;
}
