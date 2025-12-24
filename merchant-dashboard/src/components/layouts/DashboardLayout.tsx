import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  Typography, 
  Divider, 
  IconButton, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme as useMuiTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  AccountBalance as BankIcon,
  Receipt as TransactionsIcon,
  VerifiedUser as KycIcon,
  MonetizationOn as MintIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  AttachMoney as DepositIcon,
  MoneyOff as RedeemIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import WalletConnect from '../WalletConnect';

const drawerWidth = 260;

const menuItems = [
  { text: 'Mint', icon: <MintIcon />, path: '/' },
  { text: 'Redeem', icon: <RedeemIcon />, path: '/redeem' },
  { text: 'Send', icon: <SendIcon />, path: '/send' },
  { text: 'My Transactions', icon: <TransactionsIcon />, path: '/transactions' },
  { text: 'KYC Profile', icon: <KycIcon />, path: '/kyc' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const DashboardLayout: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  
  const { logout, user } = useAuth();
  const { mode, toggleColorMode } = useTheme();
  const muiTheme = useMuiTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  
  // Close drawer on mobile by default
  React.useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setOpen(false);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: (theme) =>
            theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: (theme) =>
              theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            NTZS
          </Typography>
          
          {/* Wallet Connect */}
          <WalletConnect />
          
          {/* Theme toggle */}
          <IconButton color="inherit" onClick={toggleColorMode} sx={{ ml: 1 }}>
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          
          {/* Notifications */}
          <IconButton
            color="inherit"
            onClick={handleNotificationMenuOpen}
            sx={{ ml: 1 }}
          >
            <NotificationsIcon />
          </IconButton>
          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                width: 350,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem>
              <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleNotificationMenuClose}>
              <ListItemIcon>
                <MintIcon fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Mint Completed" 
                secondary="Your 10,000 NTZS mint request was completed"
              />
            </MenuItem>
            <MenuItem onClick={handleNotificationMenuClose}>
              <ListItemIcon>
                <KycIcon fontSize="small" color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="KYC Verified" 
                secondary="Your KYC verification has been approved"
              />
            </MenuItem>
            <MenuItem onClick={handleNotificationMenuClose}>
              <ListItemIcon>
                <BankIcon fontSize="small" color="warning" />
              </ListItemIcon>
              <ListItemText 
                primary="Redemption Processed" 
                secondary="Your 5,000 NTZS redemption is being processed"
              />
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleNotificationMenuClose} sx={{ justifyContent: 'center' }}>
              <Typography variant="body2" color="primary">View All Notifications</Typography>
            </MenuItem>
          </Menu>
          
          {/* User Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <IconButton
              onClick={handleProfileMenuOpen}
              size="small"
              sx={{ ml: 2 }}
              aria-controls="profile-menu"
              aria-haspopup="true"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                {user?.name.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
            <Typography variant="body2" sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
              {user?.name || 'User'}
            </Typography>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="profile-menu"
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      {/* Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <img 
              src="/images/neda-pay-logo.jpg" 
              alt="nTZS Logo" 
              style={{ height: 40, width: 'auto', borderRadius: 8 }} 
            />
          </Box>
          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton 
                  selected={location.pathname === item.path}
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    borderRadius: '0 24px 24px 0',
                    mr: 2,
                    ml: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ mt: 2, mb: 2 }} />
          <Box sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              Organization
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {user?.organization || 'NEDA Pay Merchant'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, mb: 1 }}>
              Role
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {user?.role || 'Merchant'}
            </Typography>
          </Box>
        </Box>
      </Drawer>
      
      {/* Main content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
