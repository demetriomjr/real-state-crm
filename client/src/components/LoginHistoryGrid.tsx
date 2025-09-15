import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
  CircularProgress,
  Alert,
  TextField,
  Button,
} from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';

interface LoginLog {
  id: string;
  login_at: string;
  ip_address?: string;
  user_agent?: string;
  success: boolean;
  failure_reason?: string;
  // Note: user_id, tenant_id, and created_at removed for security
}

interface LoginHistoryGridProps {
  userId: string;
  initialLogs?: LoginLog[];
}

const LoginHistoryGrid: React.FC<LoginHistoryGridProps> = ({ userId, initialLogs }) => {
  const { t } = useTranslation();
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [debouncedStartDate, setDebouncedStartDate] = useState<string>('');
  const [debouncedEndDate, setDebouncedEndDate] = useState<string>('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  // Validate date format and check if it's a valid date
  const isValidDate = (dateStr: string): boolean => {
    if (!dateStr || dateStr.length !== 10) return false;
    
    const [day, month, year] = dateStr.split('/').map(Number);
    if (!day || !month || !year) return false;
    
    // Check basic ranges
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2100) {
      return false;
    }
    
    // Create date object and validate
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
  };

  // Debounce the date inputs - only trigger when we have 8 digits AND valid date
  useEffect(() => {
    const timer = setTimeout(() => {
      const digitCount = startDate.replace(/\D/g, '').length;
      if (digitCount === 8 && isValidDate(startDate)) {
        setDebouncedStartDate(startDate);
      } else {
        setDebouncedStartDate('');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [startDate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const digitCount = endDate.replace(/\D/g, '').length;
      if (digitCount === 8 && isValidDate(endDate)) {
        setDebouncedEndDate(endDate);
      } else {
        setDebouncedEndDate('');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [endDate]);

  useEffect(() => {
    // Se temos logs iniciais e não há filtros aplicados, use os logs iniciais
    if (initialLogs && !debouncedStartDate && !debouncedEndDate) {
      setLoginLogs(initialLogs);
      setTotal(initialLogs.length);
      setLoading(false);
      return;
    }

    // Se há filtros aplicados, faça a chamada para a API
    // Smart filtering logic:
    // - Only start date: from that date to most recent records
    // - Only end date: from earliest records up to that date  
    // - Both dates: between those dates
    if (debouncedStartDate || debouncedEndDate) {
      const fetchFilteredLogs = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const filters: {
            page: number;
            limit: number;
            startDate?: string;
            endDate?: string;
          } = {
            page,
            limit: 100,
          };
          
          // Convert dd/mm/yyyy to ISO format for backend
          const convertToISO = (dateStr: string) => {
            if (!dateStr || dateStr.length !== 10) return null;
            const digits = dateStr.replace(/\D/g, '');
            if (digits.length !== 8) return null; // Must have exactly 8 digits
            
            const [day, month, year] = dateStr.split('/');
            if (!day || !month || !year) return null;
            
            const dayNum = parseInt(day, 10);
            const monthNum = parseInt(month, 10);
            const yearNum = parseInt(year, 10);
            
            // Basic validation
            if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 1900 || yearNum > 2100) {
              return null;
            }
            
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          };

          // Smart filtering implementation
          if (debouncedStartDate && debouncedEndDate) {
            // Both dates: filter between dates
            const startISO = convertToISO(debouncedStartDate);
            const endISO = convertToISO(debouncedEndDate);
            if (startISO) filters.startDate = startISO;
            if (endISO) filters.endDate = endISO;
          } else if (debouncedStartDate && !debouncedEndDate) {
            // Only start date: from that date to present
            const startISO = convertToISO(debouncedStartDate);
            if (startISO) filters.startDate = startISO;
            // Don't set endDate - let backend handle "to present"
          } else if (!debouncedStartDate && debouncedEndDate) {
            // Only end date: from beginning to that date
            const endISO = convertToISO(debouncedEndDate);
            if (endISO) filters.endDate = endISO;
            // Don't set startDate - let backend handle "from beginning"
          }
          
          const response = await apiService.getUserLogsWithFilters(userId, filters);
          setLoginLogs(response.logs);
          setTotal(response.total);
        } catch (err) {
          console.error('Error fetching filtered login history:', err);
          setError(t('user.loginHistory.error'));
        } finally {
          setLoading(false);
        }
      };

      fetchFilteredLogs();
    }
  }, [userId, debouncedStartDate, debouncedEndDate, page, initialLogs, t]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getBrowserInfo = (userAgent?: string) => {
    if (!userAgent) return t('user.loginHistory.unknown');
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    
    return t('user.loginHistory.unknown');
  };

  // Filter logs based on date range
  // No need for client-side filtering since we're doing server-side filtering

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setDebouncedStartDate('');
    setDebouncedEndDate('');
    setPage(1);
    
    // Quando limpar filtros, voltar aos logs iniciais
    if (initialLogs) {
      setLoginLogs(initialLogs);
      setTotal(initialLogs.length);
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Date Filter Section - Always visible */}
      <Box sx={{ mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
          <TextField
            label={t('user.loginHistory.filterStartDate')}
            value={startDate}
            onChange={(e) => {
              const input = e.target;
              const oldValue = startDate;
              const newValue = e.target.value;
              const cursorPos = input.selectionStart || 0;
              
              // Remove non-digits from new value
              const digits = newValue.replace(/\D/g, '');
              let formatted = digits;
              
              // Format with slashes
              if (digits.length >= 2) {
                formatted = digits.substring(0, 2) + '/' + digits.substring(2);
              }
              if (digits.length >= 4) {
                formatted = digits.substring(0, 2) + '/' + digits.substring(2, 4) + '/' + digits.substring(4, 8);
              }
              
              setStartDate(formatted);
              
              // Calculate new cursor position accounting for slashes
              let newCursorPos = cursorPos;
              const oldDigits = oldValue.replace(/\D/g, '');
              const newDigits = digits;
              
              // If digits were added, adjust cursor position for slashes
              if (newDigits.length > oldDigits.length) {
                // Calculate where cursor should be based on digit count
                if (newDigits.length === 2 && oldDigits.length === 1) {
                  // Just added second digit, cursor should be at position 3 (after first slash)
                  newCursorPos = 3;
                } else if (newDigits.length === 4 && oldDigits.length === 3) {
                  // Just added fourth digit, cursor should be at position 6 (after second slash)
                  newCursorPos = 6;
                } else {
                  // For other cases, maintain relative position
                  newCursorPos = cursorPos;
                }
              } else if (newDigits.length < oldDigits.length) {
                // If digits were removed (backspace), calculate proper position
                // Find where the cursor should be in the new formatted string
                if (cursorPos > formatted.length) {
                  newCursorPos = formatted.length;
                } else {
                  // Try to maintain logical position
                  newCursorPos = Math.min(cursorPos, formatted.length);
                }
              }
              
              newCursorPos = Math.min(newCursorPos, formatted.length);
              
              // Restore cursor position after state update
              setTimeout(() => {
                input.setSelectionRange(newCursorPos, newCursorPos);
              }, 0);
            }}
            size="small"
            sx={{ minWidth: 150 }}
            InputLabelProps={{ shrink: true }}
            inputProps={{ maxLength: 10 }}
          />
          <TextField
            label={t('user.loginHistory.filterEndDate')}
            value={endDate}
            onChange={(e) => {
              const input = e.target;
              const oldValue = endDate;
              const newValue = e.target.value;
              const cursorPos = input.selectionStart || 0;
              
              // Remove non-digits from new value
              const digits = newValue.replace(/\D/g, '');
              let formatted = digits;
              
              // Format with slashes
              if (digits.length >= 2) {
                formatted = digits.substring(0, 2) + '/' + digits.substring(2);
              }
              if (digits.length >= 4) {
                formatted = digits.substring(0, 2) + '/' + digits.substring(2, 4) + '/' + digits.substring(4, 8);
              }
              
              setEndDate(formatted);
              
              // Calculate new cursor position accounting for slashes
              let newCursorPos = cursorPos;
              const oldDigits = oldValue.replace(/\D/g, '');
              const newDigits = digits;
              
              // If digits were added, adjust cursor position for slashes
              if (newDigits.length > oldDigits.length) {
                // Calculate where cursor should be based on digit count
                if (newDigits.length === 2 && oldDigits.length === 1) {
                  // Just added second digit, cursor should be at position 3 (after first slash)
                  newCursorPos = 3;
                } else if (newDigits.length === 4 && oldDigits.length === 3) {
                  // Just added fourth digit, cursor should be at position 6 (after second slash)
                  newCursorPos = 6;
                } else {
                  // For other cases, maintain relative position
                  newCursorPos = cursorPos;
                }
              } else if (newDigits.length < oldDigits.length) {
                // If digits were removed (backspace), calculate proper position
                // Find where the cursor should be in the new formatted string
                if (cursorPos > formatted.length) {
                  newCursorPos = formatted.length;
                } else {
                  // Try to maintain logical position
                  newCursorPos = Math.min(cursorPos, formatted.length);
                }
              }
              
              newCursorPos = Math.min(newCursorPos, formatted.length);
              
              // Restore cursor position after state update
              setTimeout(() => {
                input.setSelectionRange(newCursorPos, newCursorPos);
              }, 0);
            }}
            size="small"
            sx={{ minWidth: 150 }}
            InputLabelProps={{ shrink: true }}
            inputProps={{ maxLength: 10 }}
          />
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              variant="outlined"
              size="small"
              onClick={clearFilters}
              startIcon={<ClearIcon />}
              disabled={!startDate && !endDate}
              sx={{
                color: 'error.main',
                borderColor: 'error.main',
                '&:hover': {
                  backgroundColor: 'error.light',
                  borderColor: 'error.dark',
                  color: 'white',
                },
              }}
            >
              {t('user.loginHistory.clearFilters')}
            </Button>
            <Typography variant="caption" color="text.secondary">
              {total} {t('user.loginHistory.results')}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Content Section */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && loginLogs.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          {t('user.loginHistory.noData')}
        </Typography>
      )}

      {!loading && !error && loginLogs.length > 0 && (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('user.loginHistory.date')}</TableCell>
                <TableCell>{t('user.loginHistory.time')}</TableCell>
                <TableCell>{t('user.loginHistory.status')}</TableCell>
                <TableCell>{t('user.loginHistory.browser')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loginLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(log.login_at)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatTime(log.login_at)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={log.success ? t('user.loginHistory.success') : t('user.loginHistory.failed')}
                      color={log.success ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {getBrowserInfo(log.user_agent)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default LoginHistoryGrid;
