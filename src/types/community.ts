import type { DeviceCategory } from './repair';

export interface CommunityPost {
    id: string;
    author_id: string | null;
    author_profile?: {
        display_name: string | null;
        avatar_url?: string | null;
        is_pro?: boolean | null;
    };
    title: string;
    content: string;
    device_category: string;
    device_model?: string | null;
    signal_strength: number;
    is_pinned: boolean | null;
    created_at: string;
    updated_at: string;
    comment_count?: number;
}

export interface CommunityComment {
    id: string;
    post_id: string;
    author_id: string | null;
    author_profile?: {
        display_name: string | null;
        avatar_url?: string | null;
        is_pro?: boolean | null;
        is_verified_tech?: boolean | null;
    };
    content: string;
    is_verified_solution: boolean | null;
    verified_by?: string | null;
    created_at: string;
    updated_at: string;
}

export interface PostLike {
    post_id: string;
    user_id: string;
    created_at: string;
}
