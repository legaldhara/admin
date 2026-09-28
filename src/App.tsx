import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useSelector } from "react-redux";
import { RootState } from "./Store/Store";
import { useAuthListener } from "./hooks/useAuthListener";
// import PageNotFound from "./components/PageNotFound";
// import { 
//   // secureApi,
//    useSecureApi } from "./config/apiClient";

import TermsAndConditions from "./components/Terms&Conditions";
import PrivacyPolicy from "./components/PrivacyPolicy";
import Users from "./pages/Users";
import Payments from "./pages/Payments";
import Services from "./pages/Services";
import Queries from "./pages/Queries";
import Applications from "./pages/Applications";
import ApplicationDetail from "./pages/ApplicationDetail";
import Email from "./pages/Email";
import Profile from "./pages/Profile";
import PanelLayout from "./components/PanelLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import CircularText from "./components/UI/CircularText/CircularText";
import Certificates from "./pages/Certificates";
import Documents from "./pages/Documents";
import CoAdminPage from "./features/coadmins/CoAdminPage";
const App = () => {

  // const { secureRequest } = useSecureApi();
  const { authChecking,
    // isAuthenticated 
  } = useSelector((state: RootState) => state.auth);

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
    return (
      <div className=" min-h-screen w-full flex justify-center items-center relative">
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
          <CircularText
            text="LEGALDHARA PVT LTD. *"
            onHover="speedUp"
            spinDuration={4}
            className="custom-class"
          />
        </div>
      </div>
    );
  }

  return (
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
  );
};

export default App;
