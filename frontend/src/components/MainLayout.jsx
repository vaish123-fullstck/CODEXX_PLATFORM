import React, { useContext } from 'react';
import { AppShell, Burger, NavLink, Button, Group, Title, Avatar, Box, Text, ScrollArea, Tooltip, ActionIcon } from '@mantine/core';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutContext } from '../context/LayoutContext';
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from '@tabler/icons-react';

export function MainLayout() {
  const { user, logout } = useContext(AuthContext);
  const { isSidebarCollapsed, toggleSidebar } = useContext(LayoutContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/landing');
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ 
        width: 280, 
        breakpoint: 'sm', 
        collapsed: { mobile: true, desktop: isSidebarCollapsed }
      }}
      padding="md"
    >
      <AppShell.Header style={{ background: '#1e1e1e', borderBottom: '1px solid #333' }}>
        <Group h="100%" px="md">
          <Tooltip label={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
            <ActionIcon variant="default" onClick={toggleSidebar} size="lg">
                {isSidebarCollapsed ? <IconLayoutSidebarLeftExpand /> : <IconLayoutSidebarLeftCollapse />}
            </ActionIcon>
          </Tooltip>
          <Title order={3}>CodeX</Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" style={{ background: '#1e1e1e', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <NavLink component={Link} to="/dashboard" label="Home" style={{ borderRadius: '4px' }} />
          <NavLink component={Link} to="/posts" label="All Projects" style={{ borderRadius: '4px' }} />
          {/* ✅ The Favorites link is now enabled */}
          <NavLink component={Link} to="/favorites" label="Favorites" style={{ borderRadius: '4px' }} />
          <Button
              component={Link}
              to="/create-post"
              fullWidth
              variant="gradient"
              gradient={{ from: 'pink', to: 'violet' }}
              mt="md"
            >
              + New Project
            </Button>
        </div>
        
        {user && (
          <Box pt="md" mt="auto" style={{ borderTop: '1px solid #333' }}>
             <Group>
                <Avatar color="violet" radius="xl">{user.username.charAt(0).toUpperCase()}</Avatar>
                <div style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>{user.username}</Text>
                    <Text c="dimmed" size="xs">{user.email}</Text>
                </div>
                <Button onClick={handleLogout} variant="subtle" color="gray">Logout</Button>
            </Group>
          </Box>
        )}
      </AppShell.Navbar>

      <AppShell.Main>
        <ScrollArea style={{ height: 'calc(100vh - 60px)' }}>
            <Box p="md">
                <Outlet /> 
            </Box>
        </ScrollArea>
      </AppShell.Main>
    </AppShell>
  );
}
