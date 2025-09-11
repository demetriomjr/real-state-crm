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
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  person_id: string;
  is_primary: boolean;
  is_default: boolean;
  created_at?: Date;
  updated_at?: Date;
}

interface AddressManagerProps {
  addresses: Address[];
  personId: string;
  onAddressesChange: (addresses: Address[]) => void;
  disabled?: boolean;
}

const AddressManager: React.FC<AddressManagerProps> = ({
  addresses,
  personId,
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
      person_id: personId,
      is_primary: false,
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
      updatedAddresses = [...addresses, newAddress];
    } else {
      updatedAddresses = addresses.map(address =>
        address.id === editingAddress.id ? editingAddress : address
      );
    }

    // Handle default logic - only one default address
    if (editingAddress.is_default) {
      updatedAddresses = updatedAddresses.map(address => {
        if (address.id !== editingAddress.id) {
          return { ...address, is_default: false };
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
    const updatedAddresses = addresses.filter(address => address.id !== addressId);
    onAddressesChange(updatedAddresses);
  };

  const handleCancel = () => {
    setEditingAddress(null);
    setIsAdding(false);
    setErrors({});
  };

  const handleFieldChange = (field: keyof Address, value: any) => {
    if (!editingAddress) return;

    setEditingAddress(prev => ({
      ...prev!,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const formatAddress = (address: Address) => {
    return `${address.street}, ${address.city}, ${address.state} ${address.postal_code}, ${address.country}`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{t('address.manager.title')}</Typography>
        {!disabled && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddAddress}
            size="small"
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
                      {address.is_primary && (
                        <Chip label={t('address.primary')} size="small" color="secondary" />
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

      {/* Add/Edit Form */}
      {editingAddress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <Card variant="outlined" sx={{ border: '2px solid', borderColor: 'primary.main' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {isAdding ? t('address.manager.addAddress') : t('address.manager.editAddress')}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label={t('address.street')}
                  value={editingAddress.street}
                  onChange={(e) => handleFieldChange('street', e.target.value)}
                  error={!!errors.street}
                  helperText={errors.street}
                />

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
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

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                  <TextField
                    fullWidth
                    label={t('address.postalCode')}
                    value={editingAddress.postal_code}
                    onChange={(e) => handleFieldChange('postal_code', e.target.value)}
                    error={!!errors.postal_code}
                    helperText={errors.postal_code}
                  />
                  <TextField
                    fullWidth
                    label={t('address.country')}
                    value={editingAddress.country}
                    onChange={(e) => handleFieldChange('country', e.target.value)}
                    error={!!errors.country}
                    helperText={errors.country}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editingAddress.is_primary}
                        onChange={(e) => handleFieldChange('is_primary', e.target.checked)}
                      />
                    }
                    label={t('address.primary')}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={editingAddress.is_default}
                        onChange={(e) => handleFieldChange('is_default', e.target.checked)}
                      />
                    }
                    label={t('address.default')}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button onClick={handleCancel}>
                    {t('common.cancel')}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSaveAddress}
                  >
                    {isAdding ? t('common.add') : t('common.save')}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Box>
  );
};

export default AddressManager;
