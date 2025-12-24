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
  InputAdornment,
  IconButton,
  Tooltip,
  Link
} from '@mui/material';
import {
  Send as SendIcon,
  AccountBalanceWallet as WalletIcon,
  ContentCopy as CopyIcon,
  QrCode as QrCodeIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';
import { useWeb3 } from '../contexts/Web3Context';

const Send: React.FC = () => {
  const { userBalance, isInitialized, account, isCorrectNetwork, refreshData } = useWeb3();
  const [destinationAddress, setDestinationAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Fetch balance when component mounts
  useEffect(() => {
    if (isInitialized && isCorrectNetwork && account) {
      refreshData();
    }
  }, [isInitialized, isCorrectNetwork, account, refreshData]);

  const handleMaxClick = () => {
    setAmount(userBalance || '0');
  };

  const handleSend = async () => {
    setError(null);
    
    // Validation
    if (!destinationAddress) {
      setError('Please enter a destination address');
      return;
    }
    
    if (!destinationAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      setError('Invalid Ethereum address format');
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (parseFloat(amount) > parseFloat(userBalance || '0')) {
      setError('Insufficient balance');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Implement actual transfer using web3Service
      // For now, simulate a transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock transaction hash
      setTxHash('0x' + Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2));
      setSuccess(true);
      
      // Refresh balance
      await refreshData();
    } catch (err: any) {
      setError(err.message || 'Failed to send tokens');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setDestinationAddress('');
    setAmount('');
    setSuccess(false);
    setTxHash(null);
    setError(null);
  };

  const isConnected = isInitialized && account;
  const balance = parseFloat(userBalance || '0');

  if (success) {
    return (
      <Box>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <SuccessIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Transfer Successful!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You have successfully sent {amount} NTZS
          </Typography>
          
          {txHash && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Transaction Hash
              </Typography>
              <Link 
                href={`https://sepolia.basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ wordBreak: 'break-all' }}
              >
                {txHash.slice(0, 20)}...{txHash.slice(-20)}
              </Link>
            </Box>
          )}
          
          <Button 
            variant="contained" 
            onClick={handleReset}
            fullWidth
            sx={{ mt: 2 }}
          >
            Send More
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

      {/* Send Card */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
          Send
        </Typography>
        
        {!isConnected && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Please connect your wallet to send tokens
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
              You will send
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
                placeholder="Amount"
                variant="standard"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!isConnected || isSubmitting}
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: '1.25rem' }
                }}
                sx={{ flex: 1 }}
              />
              <Chip 
                icon={<img src="/logo.png" alt="NTZS" style={{ width: 20, height: 20 }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />}
                label="NTZS on Base"
                sx={{ 
                  bgcolor: 'primary.light', 
                  color: 'primary.contrastText',
                  fontWeight: 'medium'
                }}
              />
            </Box>
          </Paper>
        </Box>

        {/* Destination Address */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" fontWeight="medium">
              To this address
            </Typography>
          </Box>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                placeholder="Destination Address (0x...)"
                variant="standard"
                fullWidth
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                disabled={!isConnected || isSubmitting}
                InputProps={{
                  disableUnderline: true,
                  sx: { fontFamily: 'monospace' }
                }}
              />
              <Tooltip title="Paste from clipboard">
                <IconButton 
                  size="small"
                  onClick={async () => {
                    const text = await navigator.clipboard.readText();
                    setDestinationAddress(text);
                  }}
                >
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Scan QR Code">
                <IconButton size="small">
                  <QrCodeIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>
        </Box>

        {/* Send Button */}
        <Button
          variant="contained"
          size="large"
          fullWidth
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          onClick={handleSend}
          disabled={!isConnected || isSubmitting || !amount || !destinationAddress}
          sx={{ 
            py: 1.5, 
            borderRadius: 2,
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          {isSubmitting ? 'Sending...' : 'Send'}
        </Button>
      </Paper>
    </Box>
  );
};

export default Send;
