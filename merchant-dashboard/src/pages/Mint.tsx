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
  ContentCopy as CopyIcon,
  CheckCircle as SuccessIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useWeb3 } from '../contexts/Web3Context';

const Mint: React.FC = () => {
  const { userBalance, isInitialized, account, isCorrectNetwork, refreshData } = useWeb3();
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'mobile'>('bank');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference] = useState(`NTZS-${Math.floor(100000 + Math.random() * 900000)}`);

  useEffect(() => {
    if (isInitialized && isCorrectNetwork && account) {
      refreshData();
    }
  }, [isInitialized, isCorrectNetwork, account, refreshData]);

  const isConnected = isInitialized && account;
  const balance = parseFloat(userBalance || '0');

  const bankDetails = {
    bankName: 'CRDB Bank',
    accountName: 'NEDA Pay Ltd',
    accountNumber: '0150123456700',
    branch: 'Dar es Salaam Main',
  };

  const mobileDetails = {
    provider: 'M-Pesa',
    number: '0755 123 456',
    name: 'NEDA Pay',
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleMint = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
      await refreshData();
    } catch (err: any) {
      setError(err.message || 'Failed to process mint request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setAmount('');
    setSuccess(false);
    setError(null);
  };

  if (success) {
    return (
      <Box>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <SuccessIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Mint Request Submitted!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Your request to mint {parseFloat(amount).toLocaleString()} NTZS has been submitted.
          </Typography>
          <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
            Please complete your {paymentMethod === 'bank' ? 'bank transfer' : 'mobile money'} payment using reference: <strong>{reference}</strong>
          </Alert>
          <Button variant="contained" onClick={handleReset} fullWidth>
            Mint More
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

      {/* Mint Card */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            Mint
          </Typography>
          <Tooltip title="Deposit TSH to receive NTZS tokens at 1:1 rate">
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Payment Method Toggle */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
            Payment Method
          </Typography>
          <ToggleButtonGroup
            value={paymentMethod}
            exclusive
            onChange={(_, value) => value && setPaymentMethod(value)}
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
              <BankIcon sx={{ mr: 1 }} /> Bank Transfer
            </ToggleButton>
            <ToggleButton value="mobile">
              <MobileIcon sx={{ mr: 1 }} /> Mobile Money
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Amount Input */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
            Amount (TSH)
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <TextField
                placeholder="0"
                variant="standard"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isSubmitting}
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: '1.5rem', fontWeight: 'bold' }
                }}
                sx={{ flex: 1 }}
              />
              <Chip 
                label="TSH"
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
          </Paper>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            You will receive: <strong>{amount ? parseFloat(amount).toLocaleString() : '0'} NTZS</strong>
          </Typography>
        </Box>

        {/* Payment Details */}
        <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: 'action.hover' }}>
          <Typography variant="body2" fontWeight="bold" sx={{ mb: 1.5 }}>
            {paymentMethod === 'bank' ? 'Bank Transfer Details' : 'Mobile Money Details'}
          </Typography>
          
          {paymentMethod === 'bank' ? (
            <Box sx={{ '& > div': { display: 'flex', justifyContent: 'space-between', mb: 1 } }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Bank</Typography>
                <Typography variant="body2" fontWeight="medium">{bankDetails.bankName}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Account Name</Typography>
                <Typography variant="body2" fontWeight="medium">{bankDetails.accountName}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Account Number</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" fontWeight="medium" sx={{ fontFamily: 'monospace' }}>
                    {bankDetails.accountNumber}
                  </Typography>
                  <IconButton size="small" onClick={() => handleCopy(bankDetails.accountNumber)}>
                    <CopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Reference</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" fontWeight="medium" color="primary">
                    {reference}
                  </Typography>
                  <IconButton size="small" onClick={() => handleCopy(reference)}>
                    <CopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box sx={{ '& > div': { display: 'flex', justifyContent: 'space-between', mb: 1 } }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Provider</Typography>
                <Typography variant="body2" fontWeight="medium">{mobileDetails.provider}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Number</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" fontWeight="medium" sx={{ fontFamily: 'monospace' }}>
                    {mobileDetails.number}
                  </Typography>
                  <IconButton size="small" onClick={() => handleCopy(mobileDetails.number.replace(/\s/g, ''))}>
                    <CopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Name</Typography>
                <Typography variant="body2" fontWeight="medium">{mobileDetails.name}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Reference</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" fontWeight="medium" color="primary">
                    {reference}
                  </Typography>
                  <IconButton size="small" onClick={() => handleCopy(reference)}>
                    <CopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          )}
        </Paper>

        {/* Mint Button */}
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleMint}
          disabled={isSubmitting || !amount}
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
            'Confirm Mint Request'
          )}
        </Button>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
          After making payment, your NTZS will be credited within 1-24 hours
        </Typography>
      </Paper>
    </Box>
  );
};

export default Mint;
