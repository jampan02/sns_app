export type POST = {
    id: number;
    user_id: number;
    site_name: string;
    title: string;
    image: string;
    url: string;
    body: string;
    created_at: string;
    updated_at: string;
};

export type USER = {
    id: number;
    name: string;
    profile_image?: string;
    email: string;
    email_verified_at: null;
    created_at: string;
    updated_at: string;
};

export type LIKE = {
    id: number;
    user_id: number;
    post_id: number;
    created_at: string;
    updated_at: string;
};

export type COMMENT = {
    id: number;
    user_id: number;
    post_id: number;
    comment: string;
    created_at: string;
    updated_at: string;
};

export type MIXED_POST_DATA = {
    post: POST;
    user: USER;
    likes: LIKE[];
};
