import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Title, Text, Card, SimpleGrid, Group, Box, Menu, ActionIcon } from '@mantine/core';
import { IconDotsVertical, IconBookmark, IconBookmarkOff } from '@tabler/icons-react';
import Editor from "@monaco-editor/react";
import { AuthContext } from '../context/AuthContext';
import { LayoutContext } from '../context/LayoutContext';
import './PostCard.css'; // This CSS file provides the aurora hover effect

// This is the updated PostCard with a functional "Save" feature
const PostCard = ({ post }) => {
    const { collapseSidebar } = useContext(LayoutContext);
    const { user, updateUser } = useContext(AuthContext); // Get user and updateUser function
    const navigate = useNavigate();
    
    // State to track if the post is a favorite
    const [isFavorite, setIsFavorite] = useState(user?.favorites?.includes(post._id));

    // Update favorite status if the user object changes
    useEffect(() => {
        setIsFavorite(user?.favorites?.includes(post._id));
    }, [user, post._id]);

    const handleViewClick = () => {
        collapseSidebar();
        navigate(`/posts/${post._id}`);
    };

    const handleSaveToFavorites = async (e) => {
        e.stopPropagation(); // Prevent the card's click event from firing
        
        try {
            await axios.post(`http://localhost:5000/api/users/favorites/${post._id}`);
            setIsFavorite(!isFavorite);
            // After a successful API call, we refetch the user to update the context globally
            if (updateUser) {
                updateUser(); 
            }
        } catch (error) {
            console.error("Failed to save favorite:", error);
            alert("Error saving to favorites. Please make sure you are logged in.");
        }
    };

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder className="postCard">
            {/* Card Header */}
            <Group justify="space-between" mb="xs">
                <Box onClick={handleViewClick} style={{ cursor: 'pointer', flex: 1 }}>
                    <Title order={4}>{post.title}</Title>
                    <Text size="sm" c="dimmed">by {post.author ? post.author.username : 'Unknown'}</Text>
                </Box>
                {/* ✅ The menu is now restored with a "Save" option */}
                <Menu shadow="md" width={200} position="bottom-end" withArrow>
                    <Menu.Target>
                        <ActionIcon variant="subtle" color="gray"><IconDotsVertical /></ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item 
                            leftSection={isFavorite ? <IconBookmarkOff size={14} /> : <IconBookmark size={14} />} 
                            onClick={handleSaveToFavorites}
                            color={isFavorite ? 'red' : ''}
                        >
                            {isFavorite ? 'Remove from Favorites' : 'Save to Favorites'}
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Group>

            {/* Mini Code Editor for the snippet */}
            <Card.Section onClick={handleViewClick} style={{ cursor: 'pointer' }}>
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

const Dashboard = () => {
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

    if (loading) return <Text>Loading your feed...</Text>;

    return (
        <>
            <Title order={2} mb="xl">Your Feed</Title>
            {posts.length === 0 ? (
                <Text>No projects yet. <Link to="/create-post">Be the first!</Link></Text>
            ) : (
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                    {posts.map(post => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </SimpleGrid>
            )}
        </>
    );
};

export default Dashboard;
