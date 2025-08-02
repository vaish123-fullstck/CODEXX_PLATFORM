import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Title, Text, Card, SimpleGrid, Group, Menu, ActionIcon } from '@mantine/core';
import { IconDotsVertical, IconTrash, IconEye } from '@tabler/icons-react';
import { LayoutContext } from '../context/LayoutContext';
import './PostCard.css'; // Make sure you have created this CSS file

const PostCard = ({ post, onDelete }) => {
    const { collapseSidebar } = useContext(LayoutContext);
    const navigate = useNavigate();
    const snippet = post.blogContent.substring(0, 100) + (post.blogContent.length > 100 ? '...' : '');

    const handleViewClick = () => {
        collapseSidebar();
        navigate(`/posts/${post._id}`);
    };

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder className="postCard">
            <Group justify="space-between" mb="xs">
                {/* Make the title clickable */}
                <Title order={4} component={Link} to={`/posts/${post._id}`} onClick={collapseSidebar} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {post.title}
                </Title>
                {/* Options Menu (the three dots) */}
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <ActionIcon variant="subtle" color="gray"><IconDotsVertical /></ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item leftSection={<IconEye size={14} />} onClick={handleViewClick}>
                            View Project
                        </Menu.Item>
                        <Menu.Item color="red" leftSection={<IconTrash size={14} />} onClick={() => onDelete(post._id)}>
                            Delete Project
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Group>

            <Text size="sm" c="dimmed">
                by {post.author ? post.author.username : 'Unknown'}
            </Text>

            <Text size="sm" c="dimmed" mt="sm">
                {snippet}
            </Text>
        </Card>
    );
};

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

    // Function to handle deleting a post
    const handleDeletePost = async (postId) => {
        // Use a simple confirmation dialog
        if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            try {
                await axios.delete(`http://localhost:5000/api/posts/${postId}`);
                // Update the UI instantly by filtering out the deleted post
                setPosts(posts.filter(p => p._id !== postId));
            } catch (error) {
                console.error('Failed to delete post:', error);
                alert('Error deleting project.');
            }
        }
    };

    if (loading) {
        return <Text>Loading posts...</Text>;
    }

    return (
        <>
            <Title order={2} mb="xl">All Projects</Title>
            {posts.length === 0 ? (
                <Text>No posts yet. <Link to="/create-post">Be the first!</Link></Text>
            ) : (
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                    {posts.map(post => (
                        <PostCard key={post._id} post={post} onDelete={handleDeletePost} />
                    ))}
                </SimpleGrid>
            )}
        </>
    );
};

export default AllPosts;