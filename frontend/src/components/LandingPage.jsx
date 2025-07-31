import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Title, Text, Button, Center, Stack, Group, Box } from '@mantine/core';
import Aurora from "./Backgrounds/Aurora";

export default function LandingPage() {
  // --- Style object for the new glassmorphism header ---
  const headerStyles = {
    position: 'absolute',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 10,

    // For the glass effect
    background: 'rgba(255, 255, 255, 0.1)', // Semi-transparent background
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',

    // For the cylindrical shape
    borderRadius: '50px', // Creates the rounded ends
    padding: '8px 20px', // Some padding inside the container
  };

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: '#121212' }}>
      <Aurora />

      {/* Header using the new styles */}
      <Box component="header" style={headerStyles}>
        <Group position="center">
          <Title order={3} c="white" style={{ marginRight: '20px' }}>CodeX</Title>
          <Button component={Link} to="/auth" variant="default" radius="md">Login</Button>
          <Button component={Link} to="/auth" variant="gradient" gradient={{ from: 'pink', to: 'violet' }} radius="md">Sign Up</Button>
        </Group>
      </Box>

      {/* Main Content */}
      <Container style={{ height: '100%' }}>
        <Center style={{ height: '100%', position: 'relative', zIndex: 5 }}>
          <Stack align="center" gap="lg">
            <Title order={1} style={{ fontSize: '3.5rem', color: 'white' }}>
              Welcome to CodeX
            </Title>
            <Text size="xl" c="dimmed">
              Share, Discover, and Collaborate on Code Snippets and Technical Blogs.
            </Text>
            <Button
              component={Link}
              to="/auth"
              variant="gradient"
              gradient={{ from: 'pink', to: 'violet' }}
              size="xl"
              radius="md"
              mt="lg"
            >
              Explore Now
            </Button>
          </Stack>
        </Center>
      </Container>
    </div>
  );
}