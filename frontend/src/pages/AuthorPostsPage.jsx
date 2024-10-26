import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PostCard from '../components/Post/PostCard.jsx';
import Pagination from '../components/utilities/Pagination.jsx';
import { fetchPostsByAuthorId } from '../api/index.jsx';
import SkeletonLoader from '../components/Loading/LoadingSkeletons.jsx';
import useUser from '../hooks/useUser.js';

const AuthorPage = () => {
    const user = useUser();
    const userId = user.userId;


    const [page, setPage] = useState(1);
    const limit = 10;


    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['posts', userId, page],
        queryFn: ({ signal }) => fetchPostsByAuthorId({ signal, userId, page, limit }),
    });


    if (isError) return <div>Error fetching posts: {error.message}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Your posts</h1>

            <div className="mt-4">
                {isLoading ? (
                    <SkeletonLoader mode="mainPosts" />
                ) : (
                    <>
                        {data?.posts?.map((item) => (
                            <PostCard key={item.id} post={item} />
                        ))}
                        {data.posts.length === 0 && (
                            <div className="text-center text-gray-500">No posts found</div>
                        )}
                    </>
                )}
            </div>

            {!isLoading && data?.posts && (
                <Pagination
                    currentPage={page}
                    totalPages={data.pagination.totalPages}
                    onPageChange={setPage}
                />
            )}
        </div>
    );
};

export default AuthorPage;
