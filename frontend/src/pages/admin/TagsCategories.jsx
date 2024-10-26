import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Button from '../../components/Buttons/Button';
import { FaSave } from 'react-icons/fa';

const TagsCategories = () => {
    const queryClient = useQueryClient();
    const [newTag, setNewTag] = useState('');
    const [newCategory, setNewCategory] = useState('');

    const { data: tags } = useQuery({ queryKey: 'tags', queryFn: () => axios.get('http://localhost:3000/api/v1/tags').then((res) => res.data) });
    const { data: categories } = useQuery({ queryKey: 'categories', queryFn: () => axios.get('http://localhost:3000/api/v1/categories').then((res) => res.data) });

    const tagMutation = useMutation({
        mutationFn: (tag) => axios.post('http://localhost:3000/api/v1/tags', { name: tag }, { withCredentials: true }),
        onSuccess: () => queryClient.invalidateQueries('tags'),
    });

    const categoryMutation = useMutation({
        mutationFn: (category) => axios.post('http://localhost:3000/api/v1/categories', { name: category }, { withCredentials: true }),
        onSuccess: () => queryClient.invalidateQueries('categories'),
    });

    const handleAddTag = () => {
        if (newTag) {
            tagMutation.mutate(newTag);
            setNewTag('');
        }
    };

    const handleAddCategory = () => {
        if (newCategory) {
            categoryMutation.mutate(newCategory);
            setNewCategory('');
        }
    };

    return (
        <div className="container mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-6">Tags and Categories</h1>
            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Tags</h2>
                <ul className="mb-6 space-y-2">
                    {tags?.tags.map((tag) => (
                        <li key={tag.id} className="text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-2 rounded-md">{tag.name}</li>
                    ))}
                </ul>
                <div className="flex items-center mb-6">
                    <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="New Tag"
                        className="border border-gray-300 dark:border-gray-600 p-2 rounded mr-2 w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                    <Button color="blue" onClick={handleAddTag}><FaSave /></Button>
                </div>
            </div>
            <div>
                <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Categories</h2>
                <ul className="mb-6 space-y-2">
                    {categories?.categories.map((category) => (
                        <li key={category.id} className="text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-2 rounded-md">{category.name}</li>
                    ))}
                </ul>
                <div className="flex items-center">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New Category"
                        className="border border-gray-300 dark:border-gray-600 p-2 rounded mr-2 w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    />
                    <Button color="blue" onClick={handleAddCategory}><FaSave /></Button>
                </div>
            </div>
        </div>
    );
};

export default TagsCategories;
