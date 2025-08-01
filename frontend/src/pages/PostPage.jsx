import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Editor from "@monaco-editor/react";
import ReactMarkdown from 'react-markdown';
import { Title, Text, Paper, Grid, Stack, Box, Accordion, ThemeIcon, ScrollArea } from '@mantine/core';
import { IconFileCode, IconFolder } from '@tabler/icons-react';

// Helper to get language from file path
const getLanguageFromPath = (filePath = '') => {
    const extension = filePath.split('/').pop().split('.').pop().toLowerCase();
    switch (extension) {
        case 'js': case 'jsx': return 'javascript';
        case 'ts': case 'tsx': return 'typescript';
        case 'py': return 'python';
        case 'go': return 'go';
        case 'css': return 'css';
        case 'html': return 'html';
        case 'json': return 'json';
        case 'md': return 'markdown';
        default: return 'plaintext';
    }
};

// Helper function to build a nested tree from a flat file list
const buildFileTree = (files) => {
    if (!files || files.length === 0) return {};
    const tree = { children: {} };

    const allPaths = files.map(f => f.path.replace(/\\/g, '/').split('/'));
    let commonPathParts = [];
    if (allPaths.length > 0) {
        for (let i = 0; i < allPaths[0].length - 1; i++) {
            const part = allPaths[0][i];
            if (allPaths.every(p => p[i] === part)) {
                commonPathParts.push(part);
            } else {
                break;
            }
        }
    }
    const commonBasePath = commonPathParts.join('/') + (commonPathParts.length > 0 ? '/' : '');

    files.forEach(file => {
        const normalizedPath = file.path.replace(/\\/g, '/');
        const relativePath = normalizedPath.startsWith(commonBasePath) ? normalizedPath.substring(commonBasePath.length) : normalizedPath;
        const pathParts = relativePath.split('/').filter(p => p);
        
        let currentLevel = tree.children;
        pathParts.forEach((part, index) => {
            if (!currentLevel[part]) {
                currentLevel[part] = { children: {} };
            }
            if (index === pathParts.length - 1) {
                currentLevel[part].file = file;
            }
            currentLevel = currentLevel[part].children;
        });
    });
    return tree.children;
};


// REWRITTEN: This component now correctly renders a nested tree in a single pass.
const FileTree = ({ tree, onFileSelect, activeFilePath, isRoot = false }) => {
    return (
        <>
            {Object.entries(tree)
                .sort(([aName, aNode], [bName, bNode]) => {
                    const aIsFolder = !aNode.file;
                    const bIsFolder = !bNode.file;
                    if (aIsFolder && !bIsFolder) return -1;
                    if (!aIsFolder && bIsFolder) return 1;
                    return aName.localeCompare(bName);
                })
                .map(([name, node]) => {
                if (!node.file) { // It's a folder
                    return (
                        <Accordion.Item key={name} value={name}>
                            <Accordion.Control icon={<ThemeIcon size={24} radius="xl" variant="gradient" gradient={{ from: 'pink', to: 'violet' }}><IconFolder size={14} /></ThemeIcon>}>
                                <Text fw={isRoot ? 700 : 400} c={isRoot ? 'violet.4' : 'white'}>{name}</Text>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <div style={{ marginLeft: '1rem' }}>
                                    <FileTree tree={node.children} onFileSelect={onFileSelect} activeFilePath={activeFilePath} />
                                </div>
                            </Accordion.Panel>
                        </Accordion.Item>
                    );
                } else { // It's a file
                    return (
                        <Box
                            key={name}
                            onClick={() => onFileSelect(node.file)}
                            style={{ 
                                cursor: 'pointer', 
                                padding: '8px 12px', 
                                borderRadius: '4px', 
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: activeFilePath === node.file.path ? 'var(--mantine-color-dark-5)' : 'transparent' 
                            }}
                        >
                            <ThemeIcon size={24} radius="xl" variant="gradient" gradient={{ from: 'pink', to: 'violet' }}><IconFileCode size={14} /></ThemeIcon>
                            {name}
                        </Box>
                    );
                }
            })}
        </>
    );
};


const PostPage = () => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeFile, setActiveFile] = useState(null);
    const [fileTree, setFileTree] = useState({});

    const { id } = useParams();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
                const postData = response.data;
                setPost(postData);

                const latestVersion = postData.versions[postData.versions.length - 1];
                if (latestVersion && latestVersion.files) {
                    setFileTree(buildFileTree(latestVersion.files));

                    // Set the first file as active by default, if it exists
                    if (latestVersion.files.length > 0) {
                        setActiveFile(latestVersion.files[0]);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch post:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleFileSelect = (file) => {
        setActiveFile(file);
    };

    if (loading) return <Text>Loading Project...</Text>;
    if (!post) return <Text>Project not found.</Text>;

    return (
        <Stack>
            <Title order={2}>{post.title}</Title>
            <Text c="dimmed">by {post.author?.username || 'Unknown'}</Text>
            <Text mt="md">{post.blogContent}</Text>

            <Grid mt="lg">
                <Grid.Col span={{ base: 12, md: 5 }}>
                    <Paper withBorder radius="md">
                        <Box p="sm" bg="dark.6">
                            <Text fw={500}>Project Files</Text>
                        </Box>
                        <ScrollArea h={400}>
                            <Accordion variant="transparent" multiple>
                                <FileTree tree={fileTree} onFileSelect={handleFileSelect} activeFilePath={activeFile?.path} isRoot={true} />
                            </Accordion>
                        </ScrollArea>
                    </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 7 }}>
                    <Paper withBorder radius="md" style={{ height: '70vh' }}>
                        <Editor
                            height="100%"
                            path={activeFile?.path}
                            language={getLanguageFromPath(activeFile?.path)}
                            value={activeFile?.fileId.content || '// Select a file to view its content'}
                            theme="vs-dark"
                        />
                    </Paper>
                </Grid.Col>
            </Grid>
        </Stack>
    );
};

export default PostPage;
