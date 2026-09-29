import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import Login from "./pages/Login";
import { useSelector } from "react-redux";
import { RootState } from "./Store/Store";
import { useAuthListener } from "./hooks/useAuthListener";
import ProtectedRoute from "./components/ProtectedRoute";

const TermsAndConditions = lazy(() => import("./components/Terms&Conditions"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const PanelLayout = lazy(() => import("./components/PanelLayout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Users = lazy(() => import("./pages/Users"));
const Payments = lazy(() => import("./pages/Payments"));
const Services = lazy(() => import("./pages/Services"));
const Queries = lazy(() => import("./pages/Queries"));
const Applications = lazy(() => import("./pages/Applications"));
const ApplicationDetail = lazy(() => import("./pages/ApplicationDetail"));
const Email = lazy(() => import("./pages/Email"));
const Profile = lazy(() => import("./pages/Profile"));
const Certificates = lazy(() => import("./pages/Certificates"));
const Documents = lazy(() => import("./pages/Documents"));
const CoAdminPage = lazy(() => import("./features/coadmins/CoAdminPage"));

const loadingFallback = (
  <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Loading">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
  </div>
);

const App = () => {
  const { authChecking } = useSelector((state: RootState) => state.auth);

  // Checking Auth Session
  useAuthListener();

  // async function callApi() {
  //   try {
  //     const response = await secureApi.get('/admin/analytics/payments/summary');
  //     console.log(response.data);
  //     return response.data;

  //   } catch (error) {
  //     console.log(error);

  //   }
  // }
  // useEffect(() => {
  //   // console.log(callApi());
  // }, [])

  // callApi();

  // // Request permission & save token whenever auth state settles
  // useEffect(() => {
  //   if (!authChecking) {
  //     requestAndSaveToken(isAuthenticated, secureRequest);
  //   }
  // }, [authChecking, isAuthenticated, secureRequest]);

  // // Foreground notifications
  // useEffect(() => {
  //   listenForForegroundNotifications();
  // }, []);

  if (authChecking) {
    return loadingFallback;
  }

  return (
    <Suspense fallback={loadingFallback}>
      <Routes>
      {/* Guest */}
      <Route path="/auth" element={<Login />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/Privacy-and-Policy" element={<PrivacyPolicy />} />

      {/* Auth */}
      <Route element={<ProtectedRoute />}>
        <Route element={<PanelLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/queries" element={<Queries />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/applications/:id" element={<ApplicationDetail />} />
          <Route path="/users" element={<Users />} />
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/co-admins" element={<CoAdminPage />} />
          </Route>
          <Route path="/services" element={<Services />} />
          <Route path="/emails" element={<Email />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/settings/profile" element={<Profile />} />
          <Route path="/payments" element={<Payments />} />
          {/* Add new routes here  */}
          {/* <Route path='*' element={<PageNotFound />} /> */}
        </Route>
      </Route>

      {/* default */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
