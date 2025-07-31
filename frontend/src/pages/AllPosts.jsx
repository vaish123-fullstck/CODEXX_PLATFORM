import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AllPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/posts');
                setPosts(response.data);
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <p>Loading posts...</p>;
    }

    return (
        <div>
            <h2>All Posts</h2>
            {posts.length === 0 ? (
                <p>No posts yet. <Link to="/create-post">Be the first!</Link></p>
            ) : (
                posts.map(post => (
                    <div key={post._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                        <h3>
                            <Link to={`/posts/${post._id}`}>{post.title}</Link>
                        </h3>
                        <p>by {post.author ? post.author.username : 'Unknown'}</p>
                    </div>
                ))
            )}
        </div>
    );
};

export default AllPosts;