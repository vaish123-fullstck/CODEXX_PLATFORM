import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Editor from "@monaco-editor/react";
import { Title, Text, Paper, Grid, Stack, Button, TextInput, ScrollArea, Group, Box } from '@mantine/core';

const PostPage = () => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentCode, setCurrentCode] = useState('');
    const [commitMessage, setCommitMessage] = useState('');
    const { id } = useParams();

    const fetchPost = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
            setPost(response.data);
            // On initial load, reconstruct the latest version's code to display
            const latestVersion = response.data.versions.length - 1;
            handleVersionSelect(latestVersion, response.data.versions); // Pass versions to avoid state lag
        } catch (error) {
            console.error("Failed to fetch post:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchPost();
        }
    }, [id]);

    const handleVersionSelect = async (versionNumber, versionsArray = post.versions) => {
        try {
            // Reconstruct locally for speed if we have the data
            if (versionsArray) {
                 // You would build a local reconstruction function here for instant feedback
            }
            // For now, we'll just fetch from the server every time for simplicity
            const response = await axios.get(`http://localhost:5000/api/posts/${id}/versions/${versionNumber}`);
            setCurrentCode(response.data.code);
        } catch (error) {
            console.error("Failed to fetch version content:", error);
        }
    };
    
    const handleCommit = async () => {
        if (!commitMessage) {
            alert('Please enter a commit message.');
            return;
        }
        try {
            await axios.post(`http://localhost:5000/api/posts/${id}/versions`, {
                code: currentCode,
                commitMessage: commitMessage,
            });
            setCommitMessage('');
            fetchPost(); // Refetch all post data to update the history panel
            alert('New version saved!');
        } catch (error) {
            console.error("Failed to commit new version:", error);
        }
    };

    if (loading) return <Text>Loading post...</Text>;
    if (!post) return <Text>Post not found.</Text>;

    return (
        <Grid>
            {/* Left Column: Blog Content */}
            <Grid.Col span={{ base: 12, md: 7 }}>
                <Paper shadow="md" p="xl" radius="md" bg="#1a1a1a" withBorder>
                    <Stack>
                        <Title order={2}>{post.title}</Title>
                        <Text c="dimmed">by {post.author?.username || 'Unknown'}</Text>
                        <Text mt="md">{post.blogContent}</Text>
                    </Stack>
                </Paper>
            </Grid.Col>

            {/* Right Column: Code and Version History */}
            <Grid.Col span={{ base: 12, md: 5 }}>
                <Stack>
                    <Title order={3}>Code</Title>
                    <Paper withBorder radius="md" style={{ height: '400px' }}>
                        <Editor
                            height="100%"
                            language="javascript"
                            value={currentCode}
                            onChange={(value) => setCurrentCode(value)}
                            theme="vs-dark"
                        />
                    </Paper>
                    <Group>
                        <TextInput 
                            placeholder="Commit message (e.g., 'Added feature')"
                            value={commitMessage}
                            onChange={(e) => setCommitMessage(e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <Button onClick={handleCommit}>Commit Version</Button>
                    </Group>

                    <Title order={3} mt="lg">Version History</Title>
                    <Paper withBorder radius="md" p="md" bg="#1a1a1a" style={{ maxHeight: '300px' }}>
                        <ScrollArea h={250}>
                            <Stack>
                                {post.versions.slice().reverse().map((version) => (
                                    <Box 
                                        key={version.versionNumber} 
                                        onClick={() => handleVersionSelect(version.versionNumber)} 
                                        style={{ cursor: 'pointer', padding: '8px', borderRadius: '4px' }}
                                        sx={(theme) => ({
                                            '&:hover': {
                                              backgroundColor: theme.colors.dark[5],
                                            },
                                        })}
                                    >
                                        <Text fw={700}>Version {version.versionNumber}</Text>
                                        <Text size="sm">{version.commitMessage}</Text>
                                        <Text size="xs" c="dimmed">{new Date(version.createdAt).toLocaleString()}</Text>
                                    </Box>
                                ))}
                            </Stack>
                        </ScrollArea>
                    </Paper>
                </Stack>
            </Grid.Col>
        </Grid>
    );
};

export default PostPage;