// pages/CreatePost.js
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { fetchTags, fetchCategories, queryClient } from '../api/index';
import SkeletonLoader from '../components/Loading/LoadingSkeletons';
import TitleInput from '../components/Form/TitleInput';
import ContentInput from '../components/Form/ContentInput';
import MediaUpload from '../components/Form/MediaUpload';
import TagSelector from '../components/Form/TagSelector';
import CategorySelector from '../components/Form/CategorySelector';
import SubmitButton from '../components/Form/SubmitButton';

const CreatePost = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mediaLinks, setMediaLinks] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [errors, setErrors] = useState({}); // State for validation errors

    const { data: tags, isLoading: tagsLoading } = useQuery({
        queryKey: ['tags'],
        queryFn: fetchTags,
    });
    const { data: categories, isLoading: categoriesLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    });

    const postMutation = useMutation({
        mutationFn: (newPost) => axios.post('http://localhost:3000/api/v1/posts', newPost,{
            withCredentials: true,
        }),
        onSuccess: () => {
            queryClient.invalidateQueries(['posts']);
            navigate('/')
        },
        onError: (error) => {
            // Handle backend validation errors
            if (error.response && error.response.data.errors) {
                const validationErrors = {};
                error.response.data.errors.forEach((err) => {
                    validationErrors[err.path] = err.msg; // Map error paths to messages
                });
                setErrors(validationErrors); // Set the validation errors
            } else {
                console.error('Error creating post:', error);
            }
        },
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrors({}); // Reset errors on new submission
        const newPost = {
            title,
            content,
            mediaLinks,
            tags: selectedTags,
            categories: selectedCategories,
        };
        postMutation.mutate(newPost);
    };

    const handleTagChange = (tagId) => {
        setSelectedTags((prevTags) =>
            prevTags.includes(tagId)
                ? prevTags.filter((id) => id !== tagId)
                : [...prevTags, tagId]
        );
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategories((prevCategories) =>
            prevCategories.includes(categoryId)
                ? prevCategories.filter((id) => id !== categoryId)
                : [...prevCategories, categoryId]
        );
    };

    if (tagsLoading || categoriesLoading) return <SkeletonLoader mode="mainPosts" />;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <TitleInput title={title} setTitle={setTitle} error={errors.title} />
                <ContentInput content={content} setContent={setContent} error={errors.content} />
                <MediaUpload mediaLinks={mediaLinks} setMediaLinks={setMediaLinks} />
                <TagSelector tags={tags.tags} selectedTags={selectedTags} handleTagChange={handleTagChange} />
                <CategorySelector categories={categories.categories} selectedCategories={selectedCategories} handleCategoryChange={handleCategoryChange} />
                <SubmitButton disabled={
                    !title || !content
                } />
                {Object.keys(errors).length > 0 && (
                    <div className="mt-4 text-red-500">
                        {Object.values(errors).map((errorMsg, index) => (
                            <p key={index}>{errorMsg}</p>
                        ))}
                    </div>
                )}
            </form>
        </div>
    );
};

export default CreatePost;
