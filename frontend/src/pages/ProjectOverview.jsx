import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Title, Text, Paper, Grid, Stack, Box, Accordion, ThemeIcon, ScrollArea, Container, Textarea, Button, Group, Avatar } from '@mantine/core';
import { IconFileCode, IconFolder } from '@tabler/icons-react';
import { AuthContext } from '../context/AuthContext';

// (Helper functions like buildFileTree and getLanguageFromPath can be moved to a separate utility file later)
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

const FileTree = ({ tree, onFileSelect, isRoot = false }) => {
    const entries = Object.entries(tree);
    const folders = entries.filter(([_, node]) => !node.file);
    const files = entries.filter(([_, node]) => node.file);
    folders.sort((a, b) => a[0].localeCompare(b[0]));
    files.sort((a, b) => a[0].localeCompare(b[0]));

    return (
        <>
            {folders.map(([name, node]) => (
                <Accordion.Item key={name} value={name}>
                    <Accordion.Control icon={<ThemeIcon size={24} radius="xl" variant="gradient" gradient={{ from: 'pink', to: 'violet' }}><IconFolder size={14} /></ThemeIcon>}>
                        <Text fw={isRoot ? 700 : 400} c={isRoot ? 'violet.4' : 'white'}>{name}</Text>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <div style={{ marginLeft: '1rem' }}>
                            <FileTree tree={node.children} onFileSelect={onFileSelect} />
                        </div>
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
            {files.map(([name, node]) => (
                 <Box
                    key={name}
                    onClick={() => onFileSelect(node.file)}
                    style={{ cursor: 'pointer', padding: '8px 12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <ThemeIcon size={24} radius="xl" variant="gradient" gradient={{ from: 'pink', to: 'violet' }}><IconFileCode size={14} /></ThemeIcon>
                    {name}
                </Box>
            ))}
        </>
    );
};

const CommentsSection = ({ postId, initialComments, onCommentPosted }) => {
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        setComments(initialComments);
    }, [initialComments]);

    const handlePostComment = async () => {
        if (!user) {
            alert("Please log in to comment.");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:5000/api/posts/${postId}/comments`, {
                text: newComment,
                userId: user.id || user._id
            });
            setComments(response.data);
            setNewComment('');
            onCommentPosted();
        } catch (error) {
            console.error("Failed to post comment:", error);
            alert("Error posting comment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack>
            <Title order={4}>Comments ({comments.length})</Title>
            <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(event) => setNewComment(event.currentTarget.value)}
                minRows={3}
            />
            <Button onClick={handlePostComment} loading={loading} disabled={!newComment}>Post Comment</Button>
            
            <Stack mt="lg" gap="lg">
                {comments.map(comment => (
                    <Paper key={comment._id} withBorder p="sm" radius="md">
                        <Group>
                            <Avatar color="grape" radius="xl">{comment.author?.username?.charAt(0).toUpperCase() || '?'}</Avatar>
                            <div>
                                <Text size="sm">{comment.author?.username || 'Unknown User'}</Text>
                                <Text size="xs" c="dimmed">{new Date(comment.createdAt).toLocaleString()}</Text>
                            </div>
                        </Group>
                        <Text pl={54} pt="xs" size="sm">
                            {comment.text}
                        </Text>
                    </Paper>
                ))}
            </Stack>
        </Stack>
    );
};

const ProjectOverview = () => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [readmeContent, setReadmeContent] = useState('');
    const [fileTree, setFileTree] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchPost = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
            const postData = response.data;
            setPost(postData);
            const latestVersion = postData.versions[postData.versions.length - 1];
            if (latestVersion && latestVersion.files) {
                setFileTree(buildFileTree(latestVersion.files));
                const readmeFile = latestVersion.files.find(file => file.path.toLowerCase().includes('readme.md'));
                if (readmeFile) {
                    setReadmeContent(readmeFile.fileId.content);
                }
            }
        } catch (error) {
            console.error("Failed to fetch post:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [id]);

    const handleFileSelect = (file) => {
        navigate(`/posts/${id}/editor`);
    };

    if (loading) return <Text>Loading Project...</Text>;
    if (!post) return <Text>Project not found.</Text>;

    return (
        <Grid>
            {/* Left Column: Project Details */}
            <Grid.Col span={{ base: 12, lg: 8 }}>
                <Stack>
                    <Title order={2}>{post.title}</Title>
                    <Text c="dimmed">by {post.author?.username || 'Unknown'}</Text>
                    
                    <Paper withBorder radius="md" mt="lg">
                        <Box p="sm" bg="dark.6">
                            <Text fw={500}>Project Files</Text>
                        </Box>
                        <Accordion variant="transparent" multiple>
                            <FileTree tree={fileTree} onFileSelect={handleFileSelect} isRoot={true} />
                        </Accordion>
                    </Paper>

                    {readmeContent && (
                        <Paper withBorder radius="md" p="xl" mt="md">
                            <Title order={4} mb="sm">README.md</Title>
                            <ReactMarkdown>{readmeContent}</ReactMarkdown>
                        </Paper>
                    )}
                </Stack>
            </Grid.Col>

            {/* Right Column: Comments Section */}
            <Grid.Col span={{ base: 12, lg: 4 }}>
                <CommentsSection postId={post._id} initialComments={post.comments || []} onCommentPosted={fetchPost} />
            </Grid.Col>
        </Grid>
    );
};

export default ProjectOverview;
