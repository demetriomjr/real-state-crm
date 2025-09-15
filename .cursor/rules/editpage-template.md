# Data Edit Page Template

This template defines the standard structure and patterns for creating any data editing page in the application, based on the business page implementation. This template can be used for editing any entity (business, user, person, etc.).

## Layout Structure

### Main Container
```tsx
<Box sx={{
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  position: 'relative',
  minHeight: '100%'
}}>
```

### Content Container
```tsx
<Box sx={{
  flex: 1,
  width: '100%',
  overflowY: 'auto',
  minHeight: 0
}}>
```

### Content Wrapper (Responsive Width)
```tsx
<Box sx={{
  maxWidth: { xs: '100%', md: 1200 },
  mx: 'auto',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  flex: 1
}}>
```

### Page Title
```tsx
<Box sx={{ 
  display: 'flex',
  alignItems: 'center',
  py: 2
}}>
  <Typography 
    variant="h3" 
    component="h1"
    sx={{ 
      display: 'flex',
      alignItems: 'center',
      fontWeight: 600,
      color: 'text.primary',
      fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
    }}
  >
    <IconComponent sx={{ mr: 1, color: 'primary.main', fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }} />
    {t('entity.title')} {/* e.g., 'business.title', 'user.title', 'person.title' */}
  </Typography>
</Box>
```

### Information Cards Section
```tsx
<Box sx={{
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  gap: 1.875,
  py: 2
}}>
  {/* Left: Main Information */}
  <Card sx={{ flex: { md: '2 1 0%' } }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconComponent sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">
          {t('entity.information')} {/* e.g., 'business.information', 'user.information' */}
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Form fields */}
      </Box>
    </CardContent>
  </Card>

  {/* Right: Status/Additional Info */}
  <Card sx={{ flex: { md: '1 1 0%' } }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          {t('entity.status')} {/* e.g., 'business.status', 'user.status' */}
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Status fields */}
      </Box>
    </CardContent>
  </Card>
</Box>
```

### Tabs Section for Lists
```tsx
<Box sx={{ 
  flex: 1, 
  display: 'flex', 
  flexDirection: 'column',
  py: 2
}}>
  <Card sx={{
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  }}>
    <Tabs
      value={activeTab}
      onChange={(_, newValue) => setActiveTab(newValue)}
      variant="scrollable"
      scrollButtons="auto"
    >
      <Tab
        icon={<IconComponent />}
        label={t('entity.tabs.tabName')} {/* e.g., 'business.tabs.contacts', 'user.tabs.documents' */}
        iconPosition="start"
      />
    </Tabs>

    <CardContent sx={{ 
      pb: 6,
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0
    }}>
      {/* Tab Content with Manager Components */}
      {activeTab === 0 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ManagerComponent
            items={data.items}
            onItemsChange={handleItemsChange}
            disabled={false}
          />
        </motion.div>
      )}
    </CardContent>
  </Card>
</Box>
```

### Button Panel
```tsx
<Box sx={{
  maxWidth: { xs: '100%', md: 1200 },
  mx: 'auto',
  width: '100%',
  height: 'auto',
  flexShrink: 0,
  py: 2
}}>
  <EditPageButtonPanel
    onSave={handleSave}
    onCancel={handleCancel}
    saving={saving}
    savingText={t('entity.saving')} {/* e.g., 'business.saving', 'user.saving' */}
  />
</Box>
```

## Component Patterns

### Manager Components Structure
```tsx
// Manager components should follow this pattern for any entity:
// ContactManager, DocumentManager, AddressManager, etc.
const ManagerComponent: React.FC<ManagerProps> = ({ items, onItemsChange, disabled }) => {
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation function
  const validateItem = (item: Item): boolean => {
    // Validation logic
  };

  // Add item with max limit check (applies to all list types)
  const handleAddItem = () => {
    if (items.length >= 10) {
      toast.error(t('entity.item.maxItemsReached')); // e.g., 'business.contact.maxItemsReached'
      return;
    }
    // Add logic
  };

  // Form structure
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
        {!disabled && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddItem}
            size="small"
          >
            {t('entity.item.manager.addItem')} {/* e.g., 'business.contact.manager.addContact' */}
          </Button>
        )}
      </Box>

      {/* Existing Items List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card variant="outlined">
                <CardContent sx={{ py: 1.5 }}>
                  {/* Item display */}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>

      {/* Edit Dialog */}
      <EditDialog
        open={!!editingItem}
        onClose={handleCancel}
        onSave={handleSaveItem}
        title={isAdding ? t('entity.item.manager.addItem') : t('entity.item.manager.editItem')}
        saveDisabled={false}
        saveText={isAdding ? t('common.add') : t('common.save')}
      >
        {/* Form fields */}
      </EditDialog>
    </Box>
  );
};
```

## Form Field Patterns

### Text Fields
```tsx
<TextField
  fullWidth
  label={t('field.label')}
  value={formData.field}
  onChange={(e) => handleFieldChange('field', e.target.value)}
  error={!!errors.field}
  helperText={errors.field}
  sx={{ mb: 2 }}
/>
```

### Select Fields
```tsx
<FormControl fullWidth error={!!errors.field} sx={{ mb: 2 }}>
  <InputLabel>{t('field.label')}</InputLabel>
  <Select
    value={formData.field}
    onChange={(e) => handleFieldChange('field', e.target.value)}
    label={t('field.label')}
  >
    {OPTIONS.map((option) => (
      <MenuItem key={option.value} value={option.value}>
        {option.label}
      </MenuItem>
    ))}
  </Select>
  {errors.field && (
    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
      {errors.field}
    </Typography>
  )}
</FormControl>
```

### Switch Fields
```tsx
<FormControlLabel
  control={
    <Switch
      checked={formData.field}
      onChange={(e) => handleFieldChange('field', e.target.checked)}
    />
  }
  label={t('field.label')}
  sx={{ display: 'block', mt: 1 }}
/>
```

## State Management Patterns

### Form State
```tsx
const [formData, setFormData] = useState<FormData>({
  // Initial form data
});

const [errors, setErrors] = useState<Record<string, string>>({});
const [saving, setSaving] = useState(false);
```

### List Management
```tsx
const handleItemsChange = (items: Item[]) => {
  if (data) {
    setData(prev => ({
      ...prev!,
      items: items
    }));
  }
};
```

## Validation Patterns

### Field Validation
```tsx
const validateField = (field: string, value: any): string => {
  switch (field) {
    case 'requiredField':
      return !value?.trim() ? t('validation.fieldRequired') : '';
    case 'email':
      return !validateEmail(value) ? t('validation.invalidEmail') : '';
    default:
      return '';
  }
};
```

### Form Validation
```tsx
const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {};
  
  // Validate each field
  Object.keys(formData).forEach(field => {
    const error = validateField(field, formData[field]);
    if (error) {
      newErrors[field] = error;
    }
  });

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

## i18n Standards

### Translation Key Structure
```json
{
  "entityName": { // e.g., "business", "user", "person"
    "title": "Entity Title", // e.g., "My Business", "User Profile", "Personal Information"
    "subtitle": "Entity Subtitle",
    "information": "Information",
    "status": "Status",
    "saving": "Saving...",
    "success": "Success",
    "successMessage": "Data saved successfully",
    "validationError": "Please fix the validation errors",
    "fieldName": "Field Label",
    "validation": {
      "fieldRequired": "Field is required",
      "invalidField": "Invalid field value"
    },
    "tabs": {
      "tabName": "Tab Label" // e.g., "contacts", "documents", "addresses"
    }
  },
  "itemName": { // e.g., "contact", "document", "address"
    "manager": {
      "title": "Manage Items",
      "addItem": "Add Item", // e.g., "Add Contact", "Add Document"
      "editItem": "Edit Item"
    },
    "actions": {
      "edit": "Edit item",
      "delete": "Delete item"
    },
    "maxItemsReached": "Maximum of 10 items allowed",
    "validation": {
      "fieldRequired": "Field is required"
    }
  }
}
```

## API Integration Patterns

### Data Fetching
```tsx
const fetchData = async () => {
  try {
    setLoading(true, t('entity.loading')); // e.g., 'business.loading', 'user.loading'
    const response = await apiService.get<DataType>('/api/endpoint');
    setData(response);
    setFormData({
      // Map response to form data
    });
  } catch (error) {
    handleError(error);
  } finally {
    setLoading(false);
  }
};
```

### Data Saving
```tsx
const handleSave = async () => {
  if (!validateForm()) {
    toast.error(t('entity.validationError')); // e.g., 'business.validationError', 'user.validationError'
    return;
  }

  try {
    setSaving(true);
    const response = await apiService.put<DataType>('/api/endpoint', formData);
    setData(response);
    setSuccess(t('entity.updateSuccess')); // e.g., 'business.updateSuccess', 'user.updateSuccess'
    setShowSuccessModal(true);
  } catch (error) {
    handleError(error);
  } finally {
    setSaving(false);
  }
};
```

## Success Modal Pattern
```tsx
<Dialog
  open={showSuccessModal}
  onClose={handleSuccessModalClose}
  maxWidth="xs"
  fullWidth
  PaperProps={{
    sx: {
      maxWidth: 400,
      borderRadius: 2
    }
  }}
>
  <DialogTitle sx={{
    backgroundColor: '#4caf50',
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  }}>
    {t('entity.success')} {/* e.g., 'business.success', 'user.success' */}
  </DialogTitle>
  <DialogContent sx={{ p: 3, textAlign: 'center', pt: 2 }}>
    <Typography variant="body1" sx={{ mb: 2 }}>
      {t('entity.successMessage')} {/* e.g., 'business.successMessage', 'user.successMessage' */}
    </Typography>
  </DialogContent>
  <DialogActions sx={{ p: 3, justifyContent: 'center', pt: 1 }}>
    <Button
      variant="contained"
      onClick={handleSuccessModalClose}
      sx={{
        backgroundColor: '#4caf50',
        '&:hover': { backgroundColor: '#45a049' }
      }}
    >
      {t('common.ok')}
    </Button>
  </DialogActions>
</Dialog>
```

## Responsive Design Guidelines

1. **Width Management**: Use `maxWidth: { xs: '100%', md: 1200 }` for main containers
2. **Spacing**: Use `py: 2` for vertical spacing between sections
3. **Form Layout**: Use `flexDirection: { xs: 'column', sm: 'row' }` for responsive form fields
4. **Button Positioning**: Use `justifyContent: 'flex-end'` for action buttons
5. **Mobile Optimization**: Hide labels on mobile with `display: { xs: 'none', sm: 'block' }`

## Animation Patterns

Use Framer Motion for smooth transitions:
```tsx
import { motion, AnimatePresence } from 'framer-motion';

// Page entrance
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>

// List item animations
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.2 }}
>

// Tab content transitions
<motion.div
  initial={{ opacity: 0, x: 20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.3 }}
>
```

## Error Handling

1. **Form Validation**: Show inline errors with red borders and helper text
2. **API Errors**: Use `handleError` utility for consistent error handling
3. **Toast Notifications**: Use `react-toastify` for user feedback
4. **Loading States**: Show loading indicators during API calls

## Security Considerations

1. **Sensitive Data**: Never include sensitive fields (passwords, IDs) in response DTOs
2. **Input Validation**: Validate all inputs on both frontend and backend
3. **Authorization**: Check user permissions before allowing edits
4. **Audit Fields**: Include audit fields (created_by, updated_by) in backend operations

## Usage Examples

This template can be used for any data editing page:

### Business Edit Page
- Entity: `business`
- Tabs: `contacts`, `documents`, `addresses`
- Manager Components: `ContactManager`, `DocumentManager`, `AddressManager`

### User Edit Page
- Entity: `user`
- Tabs: `contacts`, `documents`, `addresses`, `password`
- Manager Components: `ContactManager`, `DocumentManager`, `AddressManager`, `PasswordManager`
- Additional Features: Login history grid, user level display, profile management

### Person Edit Page
- Entity: `person`
- Tabs: `contacts`, `documents`, `addresses`
- Manager Components: `ContactManager`, `DocumentManager`, `AddressManager`

### Customer Edit Page
- Entity: `customer`
- Tabs: `contacts`, `documents`, `addresses`, `leads`
- Manager Components: `ContactManager`, `DocumentManager`, `AddressManager`, `LeadManager`

## Additional Features Patterns

### Login History Grid
For user-related pages, include a login history section:
```tsx
{/* Login History Section */}
{user && (
  <Box sx={{
    maxWidth: { xs: '100%', md: 1200 },
    mx: 'auto',
    width: '100%',
    py: 2
  }}>
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            {t('entity.loginHistory')}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <LoginHistoryGrid />
      </CardContent>
    </Card>
  </Box>
)}
```

### User Level Display
For user pages, show user level with proper i18n:
```tsx
<FormControl fullWidth>
  <InputLabel>{t('user.level')}</InputLabel>
  <Select
    value={formData.user_level}
    onChange={(e) => handleFieldChange('user_level', e.target.value)}
    label={t('user.level')}
    disabled={true} // Users cannot edit their own level
  >
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
      <MenuItem key={level} value={level}>
        {t(`user.levels.${level}`)}
      </MenuItem>
    ))}
  </Select>
</FormControl>
```

### Password Change Button (Red Styling)
For user pages, style password change button in red:
```tsx
<Button
  variant="outlined"
  startIcon={<PasswordIcon />}
  onClick={() => setShowPasswordModal(true)}
  fullWidth
  sx={{ 
    color: 'error.main',
    borderColor: 'error.main',
    '&:hover': {
      borderColor: 'error.dark',
      backgroundColor: 'error.light',
      color: 'error.dark'
    }
  }}
>
  {t('password.change.title')}
</Button>
```

## Key Principles

1. **Consistency**: All edit pages should follow the same layout structure
2. **Reusability**: Manager components can be reused across different entities
3. **Responsiveness**: All layouts should work on mobile and desktop
4. **Accessibility**: Proper ARIA labels and keyboard navigation
5. **Performance**: Efficient state management and minimal re-renders
6. **Maintainability**: Clear separation of concerns and consistent patterns
7. **Security**: Never expose sensitive data (tenant_id, passwords) in frontend
8. **User Experience**: Provide clear feedback and intuitive navigation
