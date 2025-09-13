import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  Chip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import EditDialog from './common/EditDialog';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  validateCEP, 
  formatCEP, 
  fetchAddressByCEP
} from '../utils/validation';

interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface AddressManagerProps {
  addresses: Address[];
  onAddressesChange: (addresses: Address[]) => void;
  disabled?: boolean;
}

const AddressManager: React.FC<AddressManagerProps> = ({
  addresses,
  onAddressesChange,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateAddress = (address: Address): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!address.street.trim()) {
      newErrors.street = t('address.validation.streetRequired');
    }

    if (!address.city.trim()) {
      newErrors.city = t('address.validation.cityRequired');
    }

    if (!address.state.trim()) {
      newErrors.state = t('address.validation.stateRequired');
    }

    if (!address.postal_code.trim()) {
      newErrors.postal_code = t('address.validation.postalCodeRequired');
    } else if (!validateCEP(address.postal_code)) {
      newErrors.postal_code = t('address.validation.invalidCEP');
    }

    if (!address.country.trim()) {
      newErrors.country = t('address.validation.countryRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAddress = () => {
    const newAddress: Address = {
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'Brazil',
      is_default: false,
    };
    setEditingAddress(newAddress);
    setIsAdding(true);
    setErrors({});
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress({ ...address });
    setIsAdding(false);
    setErrors({});
  };

  const handleSaveAddress = () => {
    if (!editingAddress || !validateAddress(editingAddress)) {
      return;
    }

    let updatedAddresses: Address[];

    if (isAdding) {
      const newAddress = {
        ...editingAddress,
        id: `temp_${Date.now()}`,
      };
      
      // If this is the first address and user didn't explicitly set it, make it default automatically
      if (addresses.length === 0 && !editingAddress.is_default) {
        newAddress.is_default = true;
      }
      
      updatedAddresses = [...addresses, newAddress];
    } else {
      updatedAddresses = addresses.map(address =>
        address.id === editingAddress.id ? editingAddress : address
      );
    }

    // Handle default logic - ensure only one default address
    // If the current address is being set as default, unset all others first
    if (editingAddress.is_default) {
      updatedAddresses = updatedAddresses.map(address => {
        // For new addresses, compare by position in the array
        // For existing addresses, compare by ID
        if (isAdding) {
          // If adding, unset all existing addresses
          return address.id?.startsWith('temp_') ? address : { ...address, is_default: false };
        } else {
          // If editing, unset all others except the current one
          return address.id !== editingAddress.id ? { ...address, is_default: false } : address;
        }
      });
    }
    
    // If no default exists, make the first one default
    const defaultAddresses = updatedAddresses.filter(a => a.is_default);
    if (defaultAddresses.length === 0 && updatedAddresses.length > 0) {
      updatedAddresses = updatedAddresses.map((address, index) => {
        if (index === 0) {
          return { ...address, is_default: true };
        }
        return address;
      });
    }

    onAddressesChange(updatedAddresses);
    setEditingAddress(null);
    setIsAdding(false);
    setErrors({});
  };

  const handleDeleteAddress = (addressId: string) => {
    const addressToDelete = addresses.find(a => a.id === addressId);
    if (!addressToDelete) return;
    
    const updatedAddresses = addresses.filter(address => address.id !== addressId);
    
    // If we deleted the default address, make another one default
    if (addressToDelete.is_default && updatedAddresses.length > 0) {
      // Make the first remaining address default
      const updatedAddressesWithNewDefault = updatedAddresses.map((address, index) => {
        if (index === 0) {
          return { ...address, is_default: true };
        }
        return address;
      });
      onAddressesChange(updatedAddressesWithNewDefault);
      return;
    }
    
    onAddressesChange(updatedAddresses);
  };

  const handleCancel = () => {
    setEditingAddress(null);
    setIsAdding(false);
    setErrors({});
  };

  const handleFieldChange = (field: keyof Address, value: string | boolean) => {
    if (!editingAddress) return;

    let processedValue = value;
    
    // Format CEP and trigger address lookup
    if (field === 'postal_code' && typeof value === 'string') {
      processedValue = formatCEP(value);
      
      // Trigger ViaCEP lookup when CEP is complete
      if (validateCEP(processedValue)) {
        handleCEPLookup(processedValue);
      }
    }

    setEditingAddress(prev => ({
      ...prev!,
      [field]: processedValue,
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleCEPLookup = async (cep: string) => {
    if (!editingAddress) return;
    
    try {
      const addressData = await fetchAddressByCEP(cep);
      if (addressData) {
        setEditingAddress(prev => ({
          ...prev!,
          street: addressData.logradouro || prev!.street,
          city: addressData.localidade || prev!.city,
          state: addressData.uf || prev!.state,
          country: 'Brazil', // Default to Brazil for ViaCEP
        }));
      }
    } catch (error) {
      console.error('Error fetching address from ViaCEP:', error);
    }
  };

  const formatAddress = (address: Address) => {
    return `${address.street}, ${address.city}, ${address.state} ${formatCEP(address.postal_code)}, ${address.country}`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: { xs: 'none', sm: 'block' } }}>
          {t('address.manager.title')}
        </Typography>
        {!disabled && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddAddress}
            size="small"
            sx={{ ml: { xs: 'auto', sm: 0 } }}
          >
            {t('address.manager.addAddress')}
          </Button>
        )}
      </Box>

      {/* Existing Addresses */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
        <AnimatePresence>
          {addresses.map((address) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card variant="outlined">
                <CardContent sx={{ py: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon />
                      <Box>
                        <Typography variant="body1">
                          {formatAddress(address)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {address.is_default && (
                        <Chip label={t('address.default')} size="small" color="primary" />
                      )}
                      {!disabled && (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => handleEditAddress(address)}
                            title={t('address.actions.edit')}
                            aria-label={t('address.actions.edit')}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteAddress(address.id!)}
                            color="error"
                            title={t('address.actions.delete')}
                            aria-label={t('address.actions.delete')}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>

      {/* Edit Dialog */}
      <EditDialog
        open={!!editingAddress}
        onClose={handleCancel}
        onSave={handleSaveAddress}
        title={isAdding ? t('address.manager.addAddress') : t('address.manager.editAddress')}
        saveDisabled={false}
        saveText={isAdding ? t('common.add') : t('common.save')}
      >
        {editingAddress && (
          <>
            {/* ZIP Code Row - Top Priority */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2, alignItems: { sm: 'flex-end' } }}>
              <TextField
                fullWidth
                label={t('address.postalCode')}
                value={editingAddress.postal_code}
                onChange={(e) => handleFieldChange('postal_code', e.target.value)}
                error={!!errors.postal_code}
                helperText={errors.postal_code}
                sx={{ flex: { sm: '0 0 200px' } }}
              />
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  flex: 1,
                  fontSize: '0.875rem',
                  lineHeight: 1.4,
                  mt: { xs: 0, sm: 1 }
                }}
              >
                {t('address.zipCodeHelp')}
              </Typography>
            </Box>

            <TextField
              fullWidth
              label={t('address.street')}
              value={editingAddress.street}
              onChange={(e) => handleFieldChange('street', e.target.value)}
              error={!!errors.street}
              helperText={errors.street}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label={t('address.city')}
                value={editingAddress.city}
                onChange={(e) => handleFieldChange('city', e.target.value)}
                error={!!errors.city}
                helperText={errors.city}
              />
              <TextField
                fullWidth
                label={t('address.state')}
                value={editingAddress.state}
                onChange={(e) => handleFieldChange('state', e.target.value)}
                error={!!errors.state}
                helperText={errors.state}
              />
            </Box>

            <TextField
              fullWidth
              label={t('address.country')}
              value={editingAddress.country}
              onChange={(e) => handleFieldChange('country', e.target.value)}
              error={!!errors.country}
              helperText={errors.country}
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={editingAddress.is_default}
                  onChange={(e) => handleFieldChange('is_default', e.target.checked)}
                  disabled={
                    !isAdding && 
                    editingAddress.is_default && 
                    addresses.filter(a => a.is_default).length === 1
                  }
                />
              }
              label={t('address.default')}
              sx={{ display: 'block', mt: 1 }}
            />
          </>
        )}
      </EditDialog>
    </Box>
  );
};

export default AddressManager;
