import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PostCard from '../components/Post/PostCard.jsx';
import Pagination from '../components/utilities/Pagination.jsx';
import {  fetchRecommendedPosts } from '../api/index.jsx';
import SkeletonLoader from '../components/Loading/LoadingSkeletons.jsx';

const RecommendedPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['posts', page],
    queryFn: ({ signal }) => fetchRecommendedPosts({
      signal,
      page,
      limit,
    }),
  });

  if (isLoading) return <SkeletonLoader mode="mainPosts" />;
  if (isError) return <div>Error fetching posts: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Recommended</h1>
      <div className="mt-4">
        {data.posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <Pagination
        currentPage={page}
        totalPages={data.pagination.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};

export default RecommendedPage;
