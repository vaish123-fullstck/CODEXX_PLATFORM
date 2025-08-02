import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Title, Text, Card, SimpleGrid, Group, Box } from '@mantine/core';
import Editor from "@monaco-editor/react";
import { LayoutContext } from '../context/LayoutContext';
import './PostCard.css'; // Reusing the same card styles

// This PostCard is for the favorites page. It's view-only.
const FavoritePostCard = ({ post }) => {
    const { collapseSidebar } = useContext(LayoutContext);
    const navigate = useNavigate();

    const handleViewClick = () => {
        collapseSidebar();
        navigate(`/posts/${post._id}`);
    };

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder className="postCard" onClick={handleViewClick} style={{ cursor: 'pointer' }}>
            <Group justify="space-between" mb="xs">
                <Box>
                    <Title order={4}>{post.title}</Title>
                    <Text size="sm" c="dimmed">by {post.author ? post.author.username : 'Unknown'}</Text>
                </Box>
            </Group>
            <Card.Section>
                <Box style={{ height: '200px', pointerEvents: 'none' }}>
                     <Editor
                        height="100%"
                        language="javascript"
                        value={post.thumbnailCodeSnippet}
                        theme="vs-dark"
                        options={{ readOnly: true, minimap: { enabled: false }, scrollbar: { vertical: 'hidden' }, lineNumbers: 'off' }}
                    />
                </Box>
            </Card.Section>
        </Card>
    );
};

const Favorites = () => {
    const [favoritePosts, setFavoritePosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                // Call the backend endpoint to get the user's favorite posts
                const response = await axios.get('http://localhost:5000/api/users/favorites');
                setFavoritePosts(response.data);
            } catch (error) {
                console.error('Failed to fetch favorites:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    if (loading) return <Text>Loading your favorites...</Text>;

    return (
        <>
            <Title order={2} mb="xl">My Favorites</Title>
            {favoritePosts.length === 0 ? (
                <Text>You haven't saved any projects yet. Browse the feed to find projects you like!</Text>
            ) : (
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                    {favoritePosts.map(post => (
                        <FavoritePostCard key={post._id} post={post} />
                    ))}
                </SimpleGrid>
            )}
        </>
    );
};

export default Favorites;
