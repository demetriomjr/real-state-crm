import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';
import { AuthProvider } from './hooks/useAuth';
import { LoadingProvider, useLoading } from './hooks/useLoading';
import theme from './theme/theme';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import NavigationSafety from './components/NavigationSafety';
import PageErrorHandler from './components/PageErrorHandler';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Business from './pages/Business';
import './i18n';
import 'react-toastify/dist/ReactToastify.css';

const AppContent: React.FC = () => {
  const { t } = useTranslation();
  const { isLoading, loadingMessage } = useLoading();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Router>
      <ErrorBoundary>
        <NavigationSafety>
          <Routes>
            <Route 
              path="/login" 
              element={
                <PageErrorHandler fallbackTitle="Erro no Login" fallbackMessage="Ocorreu um erro na página de login. Tente recarregar a página.">
                  <Login />
                </PageErrorHandler>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PageErrorHandler fallbackTitle="Erro no Registro" fallbackMessage="Ocorreu um erro na página de registro. Tente recarregar a página.">
                  <Register />
                </PageErrorHandler>
              } 
            />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    overflow: 'hidden',
                    background: 'linear-gradient(180deg, rgba(245, 243, 240, 0.8) 0%, rgba(232, 228, 221, 0.6) 50%, rgba(215, 211, 191, 0.4) 100%)'
                  }}>
                    <Box sx={{ height: 64, flexShrink: 0 }}>
                      <Header onMenuClick={handleMenuClick} sidebarOpen={sidebarOpen} />
                    </Box>

                    <Box sx={{
                      display: 'flex',
                      flex: 1,
                      overflow: 'hidden',
                      minHeight: 0
                    }}>
                      <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />

                      <Box
                        component="main"
                        sx={{
                          flexGrow: 1,
                          width: {
                            md: sidebarOpen ? 'calc(100% - 280px)' : 'calc(100% - 64px)',
                            xs: '100%'
                          },
                          display: 'flex',
                          flexDirection: 'column',
                          overflow: 'hidden',
                          minHeight: 0
                        }}
                      >
                        {/* Content area with gradient background */}
                        <Box sx={{
                          flex: 1,
                          overflow: 'auto',
                          background: 'linear-gradient(180deg, rgba(245, 243, 240, 0.8) 0%, rgba(232, 228, 221, 0.6) 50%, rgba(215, 211, 191, 0.4) 100%)',
                          minHeight: 0
                        }}>
                          <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              height: '100%',
              minHeight: '100%'
            }}
          >
                              <Routes>
                                <Route 
                                  path="/" 
                                  element={
                                    <PageErrorHandler fallbackTitle="Erro na Página Inicial" fallbackMessage="Ocorreu um erro na página inicial. Tente recarregar a página.">
                                      <Home />
                                    </PageErrorHandler>
                                  } 
                                />
                                <Route 
                                  path="/leads" 
                                  element={
                                    <PageErrorHandler fallbackTitle="Erro na Página de Leads" fallbackMessage="Ocorreu um erro na página de leads. Tente novamente.">
                                      <div>{t('pages.comingSoon')}</div>
                                    </PageErrorHandler>
                                  } 
                                />
                                <Route 
                                  path="/customers" 
                                  element={
                                    <PageErrorHandler fallbackTitle="Erro na Página de Clientes" fallbackMessage="Ocorreu um erro na página de clientes. Tente novamente.">
                                      <div>{t('pages.comingSoon')}</div>
                                    </PageErrorHandler>
                                  } 
                                />
                                <Route 
                                  path="/business" 
                                  element={
                                    <PageErrorHandler 
                                      fallbackTitle="Erro na Página de Negócios" 
                                      fallbackMessage="Ocorreu um erro ao carregar os dados do negócio. Verifique sua conexão e tente novamente."
                                      onError={(error) => {
                                        console.error('Business page error:', error);
                                        // Log specific business page errors
                                        if (error.message.includes('toLowerCase')) {
                                          console.error('toLowerCase error detected in business page');
                                        }
                                      }}
                                    >
                                      <Business />
                                    </PageErrorHandler>
                                  } 
                                />
                                <Route 
                                  path="/chat" 
                                  element={
                                    <PageErrorHandler fallbackTitle="Erro na Página de Chat" fallbackMessage="Ocorreu um erro na página de chat. Tente novamente.">
                                      <div>{t('pages.comingSoon')}</div>
                                    </PageErrorHandler>
                                  } 
                                />
                                <Route 
                                  path="/settings" 
                                  element={
                                    <PageErrorHandler fallbackTitle="Erro na Página de Configurações" fallbackMessage="Ocorreu um erro na página de configurações. Tente novamente.">
                                      <div>{t('pages.comingSoon')}</div>
                                    </PageErrorHandler>
                                  } 
                                />
                                <Route path="*" element={<Navigate to="/" replace />} />
                              </Routes>
                            </motion.div>
                          </AnimatePresence>
                        </Box>
                      </Box>
                    </Box>

                    {/* Footer - Same level as Header */}
                    <Footer />
                  </Box>
                </ProtectedRoute>
              }
            />
          </Routes>
        </NavigationSafety>
      </ErrorBoundary>
      <LoadingSpinner open={isLoading} message={loadingMessage} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LoadingProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;
