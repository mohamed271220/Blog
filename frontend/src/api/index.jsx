import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const queryClient = new QueryClient();


const api = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    withCredentials: true,
});

export const signup = async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
};

export const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};


export const fetchPosts = async ({ signal, page = 1, searchQuery = '', limit = 10 }) => {
    const offset = (page - 1) * limit;
    const response = await api.get('/posts', {
        signal,
        params: {
            offset,
            limit,
            search: searchQuery,
        },
    });
    return response.data;
};
export const fetchRecommendedPosts = async ({ signal, page = 1, limit = 10 }) => {
    const offset = (page - 1) * limit;
    const response = await api.get('/posts/feed', {
        signal,
        params: {
            offset,
            limit,
        },
    });
    return response.data;
};

export const fetchPost = async ({ signal, id }) => {
    const response = await api.get(`/posts/${id}`, { signal });
    return response.data;
};

export const fetchComments = async ({ signal, id }) => {
    const response = await api.get(`/comments/post/${id}/tree`, { signal });
    return response.data;
}

export const fetchCategories = async () => {
    const response = await api.get('/categories');
    return response.data;
};

export const fetchPostsByCategory = async ({ signal, selectedCategory, page = 1, limit = 10 }) => {
    const offset = (page - 1) * limit;
    const response = await api.get(`/posts/category/${selectedCategory}`, {
        signal,
        params: {
            offset,
            limit,
        },
    });
    return response.data;
};

export const fetchTags = async () => {
    const response = await api.get('/tags');
    return response.data;
};

export const fetchPostsByTag = async ({ signal, selectedTag, page = 1, limit = 10 }) => {
    const offset = (page - 1) * limit;
    const response = await api.get(`/posts/tag/${selectedTag}`, {
        signal,
        params: {
            offset,
            limit,
        },
    });
    return response.data;
};