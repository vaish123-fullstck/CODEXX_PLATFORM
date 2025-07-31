import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { Title, Text, SimpleGrid, Box } from '@mantine/core';

// A simple component for displaying each post card
const PostCard = ({ post }) => (
    <Box style={{ border: '1px solid #333', borderRadius: '8px', padding: '1rem', background: '#1a1a1a' }}>
        <Title order={4}>
            <Link to={`/posts/${post._id}`} style={{ color: 'white', textDecoration: 'none' }}>
                {post.title}
            </Link>
        </Title>
        <Text c="dimmed" size="sm">by {post.author?.username || 'Unknown'}</Text>
    </Box>
);

export default function Dashboard() {
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

    return (
        <>
            <Title order={2}>Your Feed</Title>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} mt="md">
                {loading ? (
                    <Text>Loading feed...</Text>
                ) : posts.length > 0 ? (
                    posts.map(post => <PostCard key={post._id} post={post} />)
                ) : (
                    <Text>No posts yet. Click "+ New Project" to create one!</Text> 
                )}
            </SimpleGrid>
        </>
    );
}