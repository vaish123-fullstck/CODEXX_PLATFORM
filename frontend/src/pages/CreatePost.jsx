import React, { useState, useCallback, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Title, Stepper, Button, Group, TextInput, Textarea, Paper, Text, List, ThemeIcon, Progress } from '@mantine/core';
import { IconUpload, IconFile } from '@tabler/icons-react';
import { AuthContext } from '../context/AuthContext';

const IGNORE_PATTERNS = [
    '/node_modules/',
    '/.git/',
    '/.vscode/',
    '/dist/',
    '/build/',
    '.DS_Store',
    '.env'
];

const CreatePost = () => {
    const [active, setActive] = useState(0);
    const [title, setTitle] = useState('');
    const [blogContent, setBlogContent] = useState('');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0); // State for the progress bar
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const onDrop = useCallback(acceptedFiles => {
        const filteredFiles = acceptedFiles.filter(file => {
            return !IGNORE_PATTERNS.some(pattern => file.path.includes(pattern));
        });
        setFiles(filteredFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    const handleSubmit = async () => {
        if (!user || files.length === 0 || !title) {
            alert('Please fill out the title and drop a project folder to upload.');
            return;
        }
        setLoading(true);
        setUploadProgress(0); // Reset progress on new submission
        try {
            const postResponse = await axios.post('http://localhost:5000/api/posts', {
                title,
                blogContent,
                userId: user.id || user._id // ✅ FIX: Use user.id OR user._id to handle both login and refresh cases
            });
            const postId = postResponse.data._id;

            // Upload files sequentially to track progress
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append('path', file.path || file.name); 
                formData.append('content', file);
                
                await axios.post(`http://localhost:5000/api/posts/${postId}/files`, formData);
                
                // Update progress after each successful upload
                setUploadProgress(((i + 1) / files.length) * 100);
            }

            alert('Project created successfully!');
            navigate(`/posts/${postId}`);

        } catch (error) {
            alert('An error occurred during creation.');
            console.error('Failed to create post:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Title order={2} mb="xl">Create a New Project</Title>
            <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false}>
                <Stepper.Step label="Step 1" description="Project Details">
                    <TextInput label="Project Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My Awesome Project" required />
                    <Textarea label="Blog Content / Description" value={blogContent} onChange={(e) => setBlogContent(e.target.value)} placeholder="A short description of your project..." mt="md" minRows={4}/>
                </Stepper.Step>

                <Stepper.Step label="Step 2" description="Upload Files">
                    <Paper withBorder p="xl" mt="md" {...getRootProps()} style={{ cursor: 'pointer', borderColor: isDragActive ? 'var(--mantine-color-blue-6)' : '#ced4da', borderStyle: 'dashed' }}>
                        <input {...getInputProps()} />
                        <Group justify="center" align="center" style={{ minHeight: '150px', pointerEvents: 'none' }}>
                            <IconUpload size={50} color={isDragActive ? 'blue' : 'gray'} />
                            <div>
                                <Text size="xl" inline>
                                    Drag your project folder here or click to select files
                                </Text>
                                <Text size="sm" c="dimmed" inline mt={7}>
                                    Ignoring folders like node_modules and .git automatically.
                                </Text>
                            </div>
                        </Group>
                    </Paper>
                    {files.length > 0 && (
                        <Paper withBorder p="md" mt="md">
                            <Text fw={500}>Filtered files to be uploaded:</Text>
                            <List size="sm" mt="xs" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {files.map((file, index) => (
                                    <List.Item key={index} icon={<ThemeIcon size={24} radius="xl"><IconFile size={14} /></ThemeIcon>}>
                                        {file.path || file.name}
                                    </List.Item>
                                ))}
                            </List>
                        </Paper>
                    )}
                </Stepper.Step>

                <Stepper.Step label="Step 3" description="Review & Create">
                    <Title order={4}>Review Your Project</Title>
                    <Text mt="sm"><strong>Title:</strong> {title || 'Not provided'}</Text>
                    <Text><strong>Files to upload:</strong> {files.length}</Text>
                    
                    {/* Display the progress bar during upload */}
                    {loading && (
                        <>
                            <Progress value={uploadProgress} mt="md" striped animated />
                            <Text size="sm" ta="center" mt="xs">Uploading... {Math.round(uploadProgress)}%</Text>
                        </>
                    )}
                </Stepper.Step>
                <Stepper.Completed>
                    Project creation complete! Redirecting...
                </Stepper.Completed>
            </Stepper>

            <Group justify="center" mt="xl">
                {active > 0 && <Button variant="default" onClick={prevStep}>Back</Button>}
                {active < 2 && <Button onClick={nextStep} disabled={active === 0 && !title}>Next step</Button>}
                {active === 2 && <Button onClick={handleSubmit} loading={loading}>Create Project</Button>}
            </Group>
        </>
    );
};

export default CreatePost;
