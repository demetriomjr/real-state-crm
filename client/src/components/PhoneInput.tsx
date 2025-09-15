import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { Phone as PhoneIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { 
  PHONE_MASKS, 
  getAllPhoneMasks, 
  formatPhoneWithMask, 
  parsePhoneWithMask, 
  validatePhoneWithMask,
  type PhoneMask
} from '../utils/phoneMasks';

interface PhoneInputProps {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  autoComplete?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  id,
  name,
  label,
  placeholder,
  value = '',
  onChange,
  required = false,
  disabled = false,
  error = false,
  helperText,
  autoComplete = 'tel',
}) => {
  const { t } = useTranslation();
  const [currentMask, setCurrentMask] = useState(PHONE_MASKS.BR);
  const [maskedValue, setMaskedValue] = useState('');
  const [countryLabelId] = useState(`country-label-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (value) {
      const formatted = formatPhoneWithMask(value, currentMask);
      setMaskedValue(formatted);
    } else {
      setMaskedValue('');
    }
  }, [value, currentMask]);

  const handleMaskChange = (newMask: PhoneMask) => {
    setCurrentMask(newMask);
    if (value) {
      const formatted = formatPhoneWithMask(value, newMask);
      setMaskedValue(formatted);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const cleanValue = parsePhoneWithMask(inputValue, currentMask);
    
    if (onChange) {
      onChange(cleanValue);
    }
    
    const formatted = formatPhoneWithMask(cleanValue, currentMask);
    setMaskedValue(formatted);
  };

  const isValid = value ? validatePhoneWithMask(maskedValue, currentMask) : true;

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'row',
        alignItems: 'stretch',
        height: '56px',
        width: '100%',
        margin: 0,
        padding: 0,
        gap: 1
      }}
    >
      {/* Country Select - 35% width */}
      <FormControl 
        size="small" 
        sx={{ 
          flex: '0 0 35%',
          height: '56px',
          margin: 0,
          '& .MuiInputBase-root': {
            height: '56px',
            minHeight: '56px',
            maxHeight: '56px'
          },
          '& .MuiSelect-select': {
            height: '56px',
            display: 'flex',
            alignItems: 'center',
            paddingTop: 0,
            paddingBottom: 0
          }
        }}
        disabled={disabled}
        margin="none"
      >
        <InputLabel id={countryLabelId}>{t('phone.country')}</InputLabel>
        <Select
          labelId={countryLabelId}
          value={currentMask.countryCode}
          onChange={(e) => {
            const selectedMask = getAllPhoneMasks().find(
              mask => mask.countryCode === e.target.value
            );
            if (selectedMask) {
              handleMaskChange(selectedMask);
            }
          }}
          label={t('phone.country')}
          renderValue={(value) => {
            const selectedMask = getAllPhoneMasks().find(mask => mask.countryCode === value);
            return selectedMask ? selectedMask.country : value;
          }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
              },
            },
          }}
        >
          {getAllPhoneMasks().map((mask) => (
            <MenuItem key={mask.countryCode} value={mask.countryCode}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">{mask.country}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {mask.countryCode}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Phone Number Input - 65% width */}
      <TextField
        id={id}
        name={name}
        label={label || t('phone.label')}
        placeholder={placeholder || currentMask.placeholder}
        value={maskedValue}
        onChange={handleInputChange}
        required={required}
        disabled={disabled}
        error={error || (!isValid && value.length > 0)}
        helperText={
          helperText || 
          (!isValid && value.length > 0 ? t('phone.invalidFormat') : undefined)
        }
        fullWidth
        margin="none"
        autoComplete={autoComplete}
        size="small"
        sx={{ 
          flex: '0 0 65%',
          height: '56px',
          margin: 0,
          '& .MuiInputBase-root': {
            height: '56px',
            minHeight: '56px',
            maxHeight: '56px'
          },
          '& .MuiInputBase-input': {
            height: '56px',
            paddingTop: 0,
            paddingBottom: 0
          }
        }}
        InputProps={{
          startAdornment: <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
        }}
        inputProps={{
          maxLength: currentMask.mask.length,
        }}
      />
    </Box>
  );
};

export default PhoneInput;