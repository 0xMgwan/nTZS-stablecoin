import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  SwapHoriz as SwapIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';
import { useWeb3 } from '../contexts/Web3Context';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

interface Transaction {
  id: number;
  type: string;
  amount: number;
  from: string;
  to: string;
  date: string;
  status: string;
  txHash: string;
  blockNumber: number;
}

// Mock data for transactions (fallback)
const mockTransactions: Transaction[] = [
  { 
    id: 1, 
    type: 'Transfer', 
    amount: 5000, 
    from: '0x1a2b3c...', 
    to: '0x4d5e6f...', 
    date: '2025-04-07 14:32:15', 
    status: 'Confirmed',
    txHash: '0x1a2b3c4d5e6f...',
    blockNumber: 12345678
  },
  { 
    id: 2, 
    type: 'Deposit', 
    amount: 10000, 
    from: 'Bank of Tanzania', 
    to: '0x7g8h9i...', 
    date: '2025-04-07 12:15:30', 
    status: 'Confirmed',
    txHash: '0x2b3c4d5e6f7g...',
    blockNumber: 12345670
  },
  { 
    id: 3, 
    type: 'Withdrawal', 
    amount: 3000, 
    from: '0x9i0j1k...', 
    to: 'CRDB Bank', 
    date: '2025-04-06 18:45:22', 
    status: 'Confirmed',
    txHash: '0x3c4d5e6f7g8h...',
    blockNumber: 12345665
  },
  { 
    id: 4, 
    type: 'Transfer', 
    amount: 2500, 
    from: '0x2b3c4d...', 
    to: '0x5e6f7g...', 
    date: '2025-04-06 15:20:11', 
    status: 'Confirmed',
    txHash: '0x4d5e6f7g8h9i...',
    blockNumber: 12345660
  },
  { 
    id: 5, 
    type: 'Deposit', 
    amount: 8000, 
    from: 'NMB Bank', 
    to: '0x8h9i0j...', 
    date: '2025-04-06 09:10:45', 
    status: 'Confirmed',
    txHash: '0x5e6f7g8h9i0j...',
    blockNumber: 12345655
  },
  { 
    id: 6, 
    type: 'Transfer', 
    amount: 1200, 
    from: '0x3c4d5e...', 
    to: '0x6f7g8h...', 
    date: '2025-04-05 22:05:33', 
    status: 'Confirmed',
    txHash: '0x6f7g8h9i0j1k...',
    blockNumber: 12345650
  },
  { 
    id: 7, 
    type: 'Withdrawal', 
    amount: 4500, 
    from: '0x4d5e6f...', 
    to: 'Exim Bank', 
    date: '2025-04-05 16:30:18', 
    status: 'Confirmed',
    txHash: '0x7g8h9i0j1k2l...',
    blockNumber: 12345645
  },
  { 
    id: 8, 
    type: 'Transfer', 
    amount: 3300, 
    from: '0x5e6f7g...', 
    to: '0x8h9i0j...', 
    date: '2025-04-05 11:25:09', 
    status: 'Confirmed',
    txHash: '0x8h9i0j1k2l3m...',
    blockNumber: 12345640
  },
  { 
    id: 9, 
    type: 'Deposit', 
    amount: 7500, 
    from: 'Stanbic Bank', 
    to: '0x9i0j1k...', 
    date: '2025-04-04 19:40:27', 
    status: 'Confirmed',
    txHash: '0x9i0j1k2l3m4n...',
    blockNumber: 12345635
  },
  { 
    id: 10, 
    type: 'Transfer', 
    amount: 6200, 
    from: '0x6f7g8h...', 
    to: '0x9i0j1k...', 
    date: '2025-04-04 14:15:52', 
    status: 'Confirmed',
    txHash: '0x0j1k2l3m4n5o...',
    blockNumber: 12345630
  },
];

const Transactions: React.FC = () => {
  const theme = useTheme();
  const { account, isInitialized, isCorrectNetwork } = useWeb3();
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user transactions from BaseScan API
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!account || !isInitialized || !isCorrectNetwork) {
        setTransactions([]);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch from BaseScan API (Base Sepolia)
        const contractAddress = '0x2bD2305bDB279a532620d76D0c352F35B48ef2C0';
        const apiUrl = `https://api-sepolia.basescan.org/api?module=account&action=tokentx&contractaddress=${contractAddress}&address=${account}&page=1&offset=50&sort=desc`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.status === '1' && data.result) {
          const formattedTxs: Transaction[] = data.result.map((tx: any, index: number) => {
            const isIncoming = tx.to.toLowerCase() === account.toLowerCase();
            const isBurn = tx.to.toLowerCase() === '0x0000000000000000000000000000000000000000';
            
            let type = 'Transfer';
            if (isBurn) type = 'Burn';
            else if (isIncoming) type = 'Received';
            else type = 'Sent';
            
            return {
              id: index + 1,
              type,
              amount: parseFloat(tx.value) / 100, // NTZS has 2 decimals
              from: tx.from,
              to: tx.to,
              date: new Date(parseInt(tx.timeStamp) * 1000).toLocaleString(),
              status: 'Confirmed',
              txHash: tx.hash,
              blockNumber: parseInt(tx.blockNumber)
            };
          });
          setTransactions(formattedTxs);
        } else {
          // Fallback to mock data if API fails
          setTransactions(mockTransactions);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setTransactions(mockTransactions);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [account, isInitialized, isCorrectNetwork]);

  // Use real transactions or mock data
  const displayTransactions = transactions.length > 0 ? transactions : mockTransactions;
  
  // Calculate transaction stats
  const totalVolume = displayTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const deposits = displayTransactions.filter(tx => tx.type === 'Received' || tx.type === 'Deposit');
  const withdrawals = displayTransactions.filter(tx => tx.type === 'Burn' || tx.type === 'Withdrawal');
  const transfers = displayTransactions.filter(tx => tx.type === 'Sent' || tx.type === 'Transfer');
  
  const totalDeposits = deposits.reduce((sum, tx) => sum + tx.amount, 0);
  const totalWithdrawals = withdrawals.reduce((sum, tx) => sum + tx.amount, 0);
  const totalTransfers = transfers.reduce((sum, tx) => sum + tx.amount, 0);

  // Prepare data for chart
  const chartData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Transaction Volume',
        data: [totalVolume * 0.1, totalVolume * 0.15, totalVolume * 0.12, totalVolume * 0.18, totalVolume * 0.2, totalVolume * 0.15, totalVolume * 0.1],
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main + '20',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Filter transactions based on search term
  const filteredTransactions = displayTransactions.filter(tx => 
    tx.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.to.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Transfer': 
      case 'Sent': return <SwapIcon />;
      case 'Deposit': 
      case 'Received': return <ArrowDownIcon />;
      case 'Withdrawal': 
      case 'Burn': return <ArrowUpIcon />;
      default: return <ReceiptIcon />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Transfer': 
      case 'Sent': return 'primary';
      case 'Deposit': 
      case 'Received': return 'success';
      case 'Withdrawal': 
      case 'Burn': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          My Transactions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View your NTZS transaction history
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              height: '100%'
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                Total Volume
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {totalVolume.toLocaleString()} NTZS
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Across {mockTransactions.length} transactions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              height: '100%'
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="medium" gutterBottom color="success.main">
                Deposits
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {totalDeposits.toLocaleString()} NTZS
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {deposits.length} transactions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              height: '100%'
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="medium" gutterBottom color="warning.main">
                Withdrawals
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {totalWithdrawals.toLocaleString()} NTZS
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {withdrawals.length} transactions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              height: '100%'
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="medium" gutterBottom color="primary.main">
                Transfers
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {totalTransfers.toLocaleString()} NTZS
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {transfers.length} transactions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Transaction Volume Chart */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          mb: 4
        }}
      >
        <Typography variant="h6" fontWeight="medium" gutterBottom>
          Transaction Volume (Last 7 Days)
        </Typography>
        <Box sx={{ height: 300 }}>
          <Line 
            data={chartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </Box>
      </Paper>

      {/* Search and Filter */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
          <TextField
            placeholder="Search by address or transaction hash..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            }}
          />
        </Box>
        <Box>
          <Button 
            startIcon={<FilterIcon />} 
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Filters
          </Button>
          <Button variant="contained">
            Export Data
          </Button>
        </Box>
      </Box>

      {/* Transactions Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transaction Hash</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell component="th" scope="row">
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {tx.txHash}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={tx.type} 
                    color={getTypeColor(tx.type)} 
                    size="small" 
                    icon={getTypeIcon(tx.type)}
                  />
                </TableCell>
                <TableCell align="right">{tx.amount.toLocaleString()} NTZS</TableCell>
                <TableCell>
                  <Tooltip title={tx.from}>
                    <Typography variant="body2" sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {tx.from}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title={tx.to}>
                    <Typography variant="body2" sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {tx.to}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>{tx.date}</TableCell>
                <TableCell>
                  <Chip 
                    label={tx.status} 
                    color={tx.status === 'Confirmed' ? 'success' : 'warning'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton size="small">
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Transactions;
