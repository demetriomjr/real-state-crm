import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './hooks/useAuth';
import { LoadingProvider, useLoading } from './hooks/useLoading';
import theme from './theme/theme';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flex: 1 }}>
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
                  <Layout>
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
                  </Layout>
                </ProtectedRoute>
              }
            />
              </Routes>
            </NavigationSafety>
          </ErrorBoundary>
        </Router>
      </div>
      <Footer />
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
    </div>
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
