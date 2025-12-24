import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Link,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  AccountBalance as BankIcon,
  Phone as MobileIcon,
  AccountBalanceWallet as WalletIcon,
  CheckCircle as SuccessIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useWeb3 } from '../contexts/Web3Context';

const Redeem: React.FC = () => {
  const { userBalance, isInitialized, account, isCorrectNetwork, refreshData } = useWeb3();
  const [withdrawMethod, setWithdrawMethod] = useState<'bank' | 'mobile'>('bank');
  const [amount, setAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isInitialized && isCorrectNetwork && account) {
      refreshData();
    }
  }, [isInitialized, isCorrectNetwork, account, refreshData]);

  const isConnected = isInitialized && account;
  const balance = parseFloat(userBalance || '0');

  const handleMaxClick = () => {
    setAmount(userBalance || '0');
  };

  const handleRedeem = async () => {
    setError(null);

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > balance) {
      setError('Insufficient NTZS balance');
      return;
    }

    if (withdrawMethod === 'bank' && !bankAccount) {
      setError('Please enter your bank account number');
      return;
    }

    if (withdrawMethod === 'mobile' && !mobileNumber) {
      setError('Please enter your mobile money number');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
      await refreshData();
    } catch (err: any) {
      setError(err.message || 'Failed to process redemption');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setAmount('');
    setBankAccount('');
    setMobileNumber('');
    setSuccess(false);
    setError(null);
  };

  if (success) {
    return (
      <Box>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <SuccessIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Redemption Submitted!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Your request to redeem {parseFloat(amount).toLocaleString()} NTZS has been submitted.
          </Typography>
          <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
            TSH {parseFloat(amount).toLocaleString()} will be sent to your {withdrawMethod === 'bank' ? 'bank account' : 'mobile money'} within 1-24 hours.
          </Alert>
          <Button variant="contained" onClick={handleReset} fullWidth>
            Redeem More
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      {/* Balance Card */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 3, 
          background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
          color: 'white',
          borderRadius: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <WalletIcon sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">Your Balance</Typography>
            </Box>
            <Typography variant="h4" fontWeight="bold">
              {isConnected ? `${balance.toLocaleString()} NTZS` : '-- NTZS'}
            </Typography>
          </Box>
          {isConnected && (
            <Chip 
              label={`${account?.slice(0, 6)}...${account?.slice(-4)}`} 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
            />
          )}
        </Box>
      </Paper>

      {/* Redeem Card */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            Redeem
          </Typography>
          <Tooltip title="Burn NTZS tokens to receive TSH at 1:1 rate">
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {!isConnected && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Please connect your wallet to redeem tokens
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Amount Input */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" fontWeight="medium">
              Amount to Redeem
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <WalletIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
              {balance.toLocaleString()} NTZS
              <Link 
                component="button" 
                onClick={handleMaxClick}
                sx={{ ml: 1, fontWeight: 'bold' }}
              >
                Max
              </Link>
            </Typography>
          </Box>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <TextField
                placeholder="0"
                variant="standard"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!isConnected || isSubmitting}
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: '1.5rem', fontWeight: 'bold' }
                }}
                sx={{ flex: 1 }}
              />
              <Chip 
                label="NTZS"
                sx={{ fontWeight: 'bold', bgcolor: 'primary.light', color: 'primary.contrastText' }}
              />
            </Box>
          </Paper>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            You will receive: <strong>TSH {amount ? parseFloat(amount).toLocaleString() : '0'}</strong>
          </Typography>
        </Box>

        {/* Withdrawal Method Toggle */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
            Receive To
          </Typography>
          <ToggleButtonGroup
            value={withdrawMethod}
            exclusive
            onChange={(_, value) => value && setWithdrawMethod(value)}
            fullWidth
            sx={{ 
              '& .MuiToggleButton-root': { 
                py: 1.5,
                textTransform: 'none',
                fontWeight: 'medium'
              }
            }}
          >
            <ToggleButton value="bank">
              <BankIcon sx={{ mr: 1 }} /> Bank Account
            </ToggleButton>
            <ToggleButton value="mobile">
              <MobileIcon sx={{ mr: 1 }} /> Mobile Money
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Account Details Input */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
            {withdrawMethod === 'bank' ? 'Bank Account Number' : 'Mobile Money Number'}
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <TextField
              placeholder={withdrawMethod === 'bank' ? 'Enter your bank account number' : 'Enter your mobile number (e.g., 0755123456)'}
              variant="standard"
              fullWidth
              value={withdrawMethod === 'bank' ? bankAccount : mobileNumber}
              onChange={(e) => withdrawMethod === 'bank' ? setBankAccount(e.target.value) : setMobileNumber(e.target.value)}
              disabled={!isConnected || isSubmitting}
              InputProps={{
                disableUnderline: true,
                sx: { fontFamily: 'monospace' }
              }}
            />
          </Paper>
        </Box>

        {/* Redeem Button */}
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleRedeem}
          disabled={!isConnected || isSubmitting || !amount}
          sx={{ 
            py: 1.5, 
            borderRadius: 2,
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Confirm Redemption'
          )}
        </Button>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
          Funds will be sent to your account within 1-24 hours
        </Typography>
      </Paper>
    </Box>
  );
};

export default Redeem;
