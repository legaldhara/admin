// // import { RecaptchaVerifier } from "firebase/auth";
// // import { auth } from "../config/FirebaseConfiguration";
// // import { useEffect, useState } from "react";
// // import { useAuthState } from "../config/apiClient";
// // import { Link, useNavigate } from "react-router-dom";
// // import CircularText from "../components/UI/CircularText/CircularText";

// // declare global {
// //   interface Window {
// //     recaptchaVerifier: RecaptchaVerifier;
// //   }
// // }

// // function Login() {
// //   const [debounceText, setDebounceText] = useState("");
// //   const [phone, setPhone] = useState("+91");
// //   const [otp, setOtp] = useState("");
// //   const navigate = useNavigate();

// //   const { isAuthenticated, isOTPSent, sendOTP, verifyOTP, loading } =
// //     useAuthState();

// //   useEffect(() => {
// //     if (isAuthenticated) {
// //       navigate("/dashboard");
// //     }
// //   }, [isAuthenticated, navigate]);

// //   useEffect(() => {
// //     if (!window.recaptchaVerifier && document.getElementById("recaptcha-container")) {
// //       try {
// //         window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
// //           size: "invisible",
// //           callback: (response: any) => {
// //             console.log("reCAPTCHA solved", response);
// //           },
// //           'expired-callback': () => {
// //             console.log("reCAPTCHA expired");
// //           }
// //         });

// //         window.recaptchaVerifier.render().then((widgetId) => {
// //           console.log("reCAPTCHA rendered:", widgetId);
// //         });

// //       } catch (error) {
// //         console.error("Failed to initialize reCAPTCHA:", error);
// //       }
// //     }

// //     return () => {
// //       if (window.recaptchaVerifier?.clear) {
// //         window.recaptchaVerifier.clear();
// //       }
// //     };
// //   }, []);


// //   useEffect(() => {
// //     const handler = setInterval(() => {
// //       setDebounceText(phone);
// //     }, 1000);

// //     return () => clearInterval(handler);
// //   }, [phone]);

// //   const handleSendOTP = async () => {
// //     if (!debounceText || !debounceText.trim()) {
// //       alert("Please enter a valid phone number");
// //       return;
// //     }

// //     if (!window.recaptchaVerifier) {
// //       console.error("RecaptchaVerifier not initialized!");
// //       return;
// //     }
// //     try {
// //       await sendOTP(debounceText, window.recaptchaVerifier);
// //     }
// //     catch (error: any) {
// //       console.error("Error sending OTP:", error.message);

// //       if (error.message?.includes("TOO_MANY_ATTEMPTS_TRY_LATER")) {
// //         alert("Too many OTP requests. Please try again later.");
// //       } else if (error.message?.includes("network")) {
// //         alert("Network error. Please check your internet connection.");
// //       } else {
// //         alert("Failed to send OTP. Please try again.");
// //       }
// //     }
// //     finally {
// //       // setButtonLoading(false);
// //     }
// //   };

// //   const handleVerifyOTP = async () => {
// //     if (!otp || !otp.trim()) {
// //       alert("Please enter the OTP");
// //       return;
// //     }
// //     try {
// //       await verifyOTP(otp)
// //         .then((res) => {
// //           if (res.payload) {
// //             console.log(res.payload);
// //             navigate("/dashboard");
// //           }
// //         })
// //         .catch(console.log);
// //     } catch (error) {
// //       console.log(error);
// //     }
// //   };

// //   return (
// //     <div className="grid grid-cols-1 md:grid-cols-2 w-full bg-blend-hard-light h-screen mx-auto">
// //       <div className="items-center justify-center py-10 pl-14 md:block hidden">
// //         <img src="home_img2.jpg" alt="banner" className="object-cover" />
// //       </div>
// //       <div className="flex items-center justify-center ">


// //         <div className="p-5 w-80 h-96 border-gray-300 border rounded-xl  flex flex-col items-center  shadow-md">
// //           {/* <img src="logo-sq.png" alt="logo" className="h-16 shadow-xl blur:drop-shadow-lg"  />
// //            */}
// //           <img
// //             src="logo-sq.png"
// //             alt="logo"
// //             className="h-16"
// //           // style={{ filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.5));" }}
// //           />
// //           <h1 className="my-3 text-lg font-semibold text-blue-950">Securities Sign In</h1>
// //           <div className="space-y-2 flex flex-col w-full">
// //             {isOTPSent ? (
// //               <input
// //                 type="text"
// //                 value={otp}
// //                 className="border border-gray-300 rounded-md px-2 py-1 placeholder:text-xs focus:outline-none"
// //                 placeholder="Enter One Time Password"
// //                 onChange={(e) => setOtp(e.target.value)}
// //               />
// //             ) : (
// //               <input
// //                 type="text"
// //                 value={phone}
// //                 className="border border-gray-300 rounded-md px-2 py-1 placeholder:text-xs focus:outline-none"
// //                 placeholder="Enter Mobile Number"
// //                 onChange={(e) => setPhone(e.target.value)}
// //               />
// //             )}
// //             <div className="relative border">
// //               <button
// //                 disabled={loading}
// //                 onClick={isOTPSent ? handleVerifyOTP : handleSendOTP}
// //                 className="w-full text-white bg-[#0e3966] rounded-md py-1.5 font-medium"
// //               >
// //                 {isOTPSent ? "Verify" : "Send"}
// //               </button>
// //               {loading && (
// //                 <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
// //                   <CircularText
// //                     text="LEGALDHARA PVT LTD. *"
// //                     onHover="speedUp"
// //                     spinDuration={5}
// //                     className="custom-class"
// //                   />
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //           <div className="w-full my-[2px] flex items-center gap-2 justify-center">
// //             <hr className="w-full h-[1px] bg-slate-400" />
// //             <h6 className="text-slate-500 text-[10px]">or</h6>
// //             <hr className="w-full h-[1px] bg-slate-500" />
// //           </div>
// //           <div className="w-full border flex border-gray-500 rounded-md justify-center items-center">
// //             <button onClick={handleSendOTP} className="p-2 text-sm font-medium bg">
// //               Continue with google
// //             </button>
// //             <img src="./google_icon.png" alt="logo" className="w-5 h-5" />
// //           </div>

// //           {/* Footer with links */}
// //           <h1 className="text-xs mt-5 text-slate-500">
// //             By signing in, you agree to the
// //           </h1>
// //           <div className="mt-2 flex justify-center flex-wrap gap-4">
// //             <Link
// //               to="/terms-and-conditions"
// //               className="text-xs text-gray-600 hover:text-gray-800 hover:underline"
// //             >
// //               Terms and Conditions
// //             </Link>
// //             <Link
// //               to="/privacy-and-policy"
// //               className="text-xs text-gray-600 hover:text-gray-800 hover:underline"
// //             >
// //               Privacy Policy
// //             </Link>
// //           </div>
// //           <div id="recaptcha-container"></div>
// //         </div>
// //       </div>

// //     </div>
// //   );
// // }

// // export default Login;




// /* eslint-disable react/no-unescaped-entities */
// import { useState, useEffect, useRef } from "react";
// import toast from "react-hot-toast";

// import { RecaptchaVerifier } from "firebase/auth";
// import { auth } from "../config/FirebaseConfiguration";
// import { useAuthState } from "../config/apiClient";
// import { Link, useNavigate } from "react-router-dom";
// // import CircularText from "../components/UI/CircularText/CircularText";
// import Lottie from "lottie-react";
// import animation from "../assets/animation.json";

// declare global {
//   interface Window {
//     recaptchaVerifier: RecaptchaVerifier;
//   }
// }

// const Login = () => {
//   const navigate = useNavigate();

//   // UI / form state
//   const [countryCode, setCountryCode] = useState("+91"); // Option A: country code + number
//   const [phoneNumber, setPhoneNumber] = useState(""); // 10-digit local number
//   const [debouncedFullNumber, setDebouncedFullNumber] = useState("");
//   const [otpScreen, setOtpScreen] = useState(false);
//   const [otp, setOtp] = useState(Array<string>(6).fill(""));
//   const otpInputsRef = useRef<Array<HTMLInputElement | null>>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isOtpLoading, setIsOtpLoading] = useState(false);
//   const [phoneError, setPhoneError] = useState("");

//   const countryCodes = ["+1", "+91", "+44", "+61"];

//   // auth state (your API)
//   const { isAuthenticated, 
//     // isOTPSent,
//      sendOTP, verifyOTP, loading } = useAuthState();

//   // redirect if already signed in
//   useEffect(() => {
//     if (isAuthenticated) navigate("/dashboard");
//   }, [isAuthenticated, navigate]);

//   // Initialize reCAPTCHA (invisible)
//   useEffect(() => {
//     if (!window.recaptchaVerifier && document.getElementById("recaptcha-container")) {
//       try {
//         window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
//           size: "invisible",
//           callback: (response: any) => {
//             console.log("reCAPTCHA solved", response);
//           },
//           "expired-callback": () => {
//             console.log("reCAPTCHA expired");
//           },
//         });

//         window.recaptchaVerifier.render().then((widgetId) => {
//           console.log("reCAPTCHA rendered:", widgetId);
//         });
//       } catch (error) {
//         console.error("Failed to initialize reCAPTCHA:", error);
//       }
//     }

//     return () => {
//       if (window.recaptchaVerifier?.clear) {
//         try {
//           window.recaptchaVerifier.clear();
//         } catch (err) {
//           // safe guard
//         }
//       }
//     };
//   }, []);

//   // Debounce full number assembly (countryCode + phoneNumber) to avoid rapid calls
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedFullNumber(`${countryCode}${phoneNumber}`);
//     }, 600);

//     return () => clearTimeout(handler);
//   }, [countryCode, phoneNumber]);

//   // phone validation: 10 digits for local number
//   const validatePhoneNumber = () => {
//     const phoneRegex = /^[0-9]{10}$/;
//     if (!phoneRegex.test(phoneNumber)) {
//       setPhoneError("Enter a valid 10-digit phone number");
//       return false;
//     }
//     setPhoneError("");
//     return true;
//   };

//   // Send OTP using your login API (sendOTP)
//   const handleGetStarted = async () => {
//     if (!validatePhoneNumber()) return;

//     if (!window.recaptchaVerifier) {
//       console.error("RecaptchaVerifier not initialized!");
//       toast.error("reCAPTCHA not initialized. Try reloading the page.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // use debouncedFullNumber (countryCode + localNumber)
//       await sendOTP(debouncedFullNumber, window.recaptchaVerifier);
//       setOtpScreen(true);
//       // isOTPSent from auth state should also flip; we keep local OTP screen state too.
//     } catch (error: any) {
//       console.error("Error sending OTP:", error?.message ?? error);
//       if (error?.message?.includes("TOO_MANY_ATTEMPTS_TRY_LATER")) {
//         toast.error("Too many OTP requests. Please try again later.");
//       } else if (String(error).toLowerCase().includes("network")) {
//         toast.error("Network error. Please check your internet connection.");
//       } else {
//         toast.error("Failed to send OTP. Please try again.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Verify OTP using your login API (verifyOTP)
//   const handleOTPSubmit = async () => {
//     const enteredOtp = otp.join("").trim();
//     if (enteredOtp.length !== 6) {
//       toast.error("Please enter a 6-digit OTP");
//       return;
//     }

//     setIsOtpLoading(true);
//     try {
//       const res = await verifyOTP(enteredOtp);
//       // your verifyOTP thunk in earlier code returned a payload on success
//       if (res?.payload) {
//         toast.success("OTP verified");
//         navigate("/dashboard");
//       } else {
//         toast.error("Invalid OTP");
//       }
//     } catch (error) {
//       console.error("OTP verify error:", error);
//       toast.error("An error occurred while verifying OTP");
//     } finally {
//       setIsOtpLoading(false);
//     }
//   };

//   // OTP input change handler with auto-focus movement
//   const handleOtpChange = (index: number, value: string) => {
//     if (!/^[0-9]*$/.test(value)) return; // allow digits only

//     const newOtp = [...otp];
//     // Only take last character if user pastes or types more than one char
//     newOtp[index] = value.slice(-1);
//     setOtp(newOtp);

//     if (value && index < otp.length - 1) {
//       otpInputsRef.current[index + 1]?.focus();
//     }
//   };

//   // handle backspace to move focus backward
//   const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
//     if (e.key === "Backspace") {
//       if (otp[index] === "") {
//         if (index > 0) {
//           otpInputsRef.current[index - 1]?.focus();
//         }
//       } else {
//         // clear current digit (handled by onChange)
//       }
//     } else if (e.key === "ArrowLeft" && index > 0) {
//       otpInputsRef.current[index - 1]?.focus();
//     } else if (e.key === "ArrowRight" && index < otp.length - 1) {
//       otpInputsRef.current[index + 1]?.focus();
//     }
//   };

//   const resendOTP = async () => {
//     // allow quick resend using same flow
//     try {
//       if (!window.recaptchaVerifier) {
//         toast.error("reCAPTCHA not initialized");
//         return;
//       }
//       setIsLoading(true);
//       await sendOTP(debouncedFullNumber, window.recaptchaVerifier);
//       toast.success("OTP resent");
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to resend OTP");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div
//       className="bg-gradient-to-tr from-yellow-500 via-slate-700 to-blue-950 bg-center min-h-screen flex flex-col justify-start"
//     >
//       <div className="flex justify-center items-start min-h-screen pt-8 ">
//         <div className="shadow-xl h-auto flex flex-col lg:flex-row bg-white rounded-[24px] w-full max-w-[1000px] relative">
//           {/* LEFT: Signup form / OTP */}
//           <div className="relative flex flex-col items-center justify-center flex-1 lg:w-1/2 p-6 md:p-12 pb-6 rounded-tl-[24px] rounded-bl-[24px] w-full">
//             {otpScreen ? (
//               <div className="w-full flex flex-col items-center justify-center gap-6 mt-4">
//                 <h2 className="text-2xl font-bold text-gray-800">
//                   Verify Your Phone Number
//                 </h2>
//                 <p className="text-gray-500">We've sent an OTP to your phone number</p>

//                 <div className="flex space-x-2 justify-center mt-4">
//                   {otp.map((digit, i) => (
//                     <input
//                       key={i}
//                       id={`otp-input-${i}`}
//                       type="text"
//                       inputMode="numeric"
//                       maxLength={1}
//                       value={digit}
//                       onChange={(e) => handleOtpChange(i, e.target.value)}
//                       onKeyDown={(e) => handleOtpKeyDown(e, i)}
//                     //   ref={(el) => (otpInputsRef.current[i] = el)}
//                       className="w-12 h-12 border border-gray-300 rounded-lg text-center text-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   ))}
//                 </div>

//                 <button
//                   className="mt-6 w-[85%] bg-orange-600 text-white py-2 px-4 rounded-full text-sm font-semibold active:bg-orange-600 transition duration-200"
//                   onClick={handleOTPSubmit}
//                   disabled={isOtpLoading}
//                 >
//                   {isOtpLoading ? "Verifying..." : "Confirm OTP"}
//                 </button>

//                 <p className="text-gray-600 text-sm mt-4">
//                   Didn't receive the OTP?{" "}
//                   <button
//                     onClick={resendOTP}
//                     className="text-blue-500 hover:underline"
//                     disabled={isLoading}
//                   >
//                     {isLoading ? "Resending..." : "Resend"}
//                   </button>
//                 </p>
//               </div>
//             ) : (
//               <div className="w-full flex flex-col items-center justify-center gap-6 mt-4">
//                 <div className="flex flex-col items-center justify-center gap-1">
//                   <h2 className="text-xl md:text-xl font-bold">LegalDhara Securities</h2>
//                   <p className="text-base font-semibold text-gray-500">
//                     Workspace to maintain LegalDhara Organization{" "}
//                     <span className="text-xl font-bold">⚡️</span>
//                   </p>
//                 </div>

//                 <div className="flex flex-col gap-1 w-[85%]">
//                   <div className="flex border border-gray-300 rounded mt-2.5 text-sm overflow-hidden">
//                     <select
//                       className="p-2 bg-white"
//                       value={countryCode}
//                       onChange={(e) => setCountryCode(e.target.value)}
//                     >
//                       {countryCodes.map((code) => (
//                         <option key={code} value={code}>
//                           {code}
//                         </option>
//                       ))}
//                     </select>
//                     <input
//                       type="text"
//                       placeholder="Phone Number"
//                       value={phoneNumber}
//                       onBlur={validatePhoneNumber}
//                       onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
//                       className="p-2 flex-1"
//                     />
//                   </div>
//                   {phoneError && (
//                     <span className="text-red-500 text-xs">{phoneError}</span>
//                   )}
//                 </div>

//                 <button
//                   className={`w-[85%] flex justify-center text-sm items-center gap-2 bg-yellow-500 text-white py-2 px-4 rounded-full`}
//                   onClick={handleGetStarted}
//                   disabled={isLoading || loading}
//                 >
//                   {isLoading || loading ? "Sending..." : "Login"}
//                 </button>

//                 {/* <p className="text-center text-gray-600 font-medium text-sm mt-2">
//                   Already have an account?{" "}
//                   <Link to="/signin" className="text-blue-500">
//                     Sign in
//                   </Link>
//                 </p> */}
//               </div>
//             )}
//           </div>

//           {/* RIGHT: Lottie animation */}
//           <div className="flex-1 rounded-r-[24px] bg-white relative overflow-hidden">
//             <Lottie animationData={animation} loop autoplay className="w-full h-[40em]" />
//           </div>
//         </div>
//       </div>

//       <div id="recaptcha-container" />
//     </div>
//   );
// };

// export default Login;


/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

import { RecaptchaVerifier } from "firebase/auth";
import { auth } from "../config/FirebaseConfiguration";
import { useAuthState } from "../config/apiClient";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animation from "../assets/animation.json";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

const Login = () => {
  const navigate = useNavigate();

  // UI / form state
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [debouncedFullNumber, setDebouncedFullNumber] = useState("");
  const [otpScreen, setOtpScreen] = useState(false);
  const [otp, setOtp] = useState(Array<string>(6).fill(""));
  const otpInputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const countryCodes = ["+1", "+91", "+44", "+61"];

  // Auth state
  const {
    isAuthenticated,
    sendOTP,
    verifyOTP,
    loading
  } = useAuthState();

  // redirect if logged in
  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  // Initialize Invisible reCAPTCHA
  useEffect(() => {
    if (!window.recaptchaVerifier && document.getElementById("recaptcha-container")) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
          callback: () => { },
          "expired-callback": () => { }
        });

        window.recaptchaVerifier.render();
      } catch (error) {
        console.error("reCAPTCHA init error:", error);
      }
    }

    return () => {
      if (window.recaptchaVerifier?.clear) {
        try {
          window.recaptchaVerifier.clear();
        } catch { }
      }
    };
  }, []);

  // Debounce country + phone
  useEffect(() => {
    const handler = setTimeout(
      () => setDebouncedFullNumber(`${countryCode}${phoneNumber}`),
      600
    );
    return () => clearTimeout(handler);
  }, [countryCode, phoneNumber]);

  // Validate phone
  const validatePhoneNumber = () => {
    const regex = /^[0-9]{10}$/;
    if (!regex.test(phoneNumber)) {
      setPhoneError("Enter a valid 10-digit phone number");
      return false;
    }
    setPhoneError("");
    return true;
  };

  // Handle sending OTP
  const handleGetStarted = async () => {
    if (!validatePhoneNumber()) return;

    if (!window.recaptchaVerifier) {
      toast.error("reCAPTCHA not initialized");
      return;
    }

    setIsLoading(true);

    try {
      await sendOTP(debouncedFullNumber, window.recaptchaVerifier);
      setOtpScreen(true);

      setTimeout(() => otpInputsRef.current[0]?.focus(), 300);
    } catch (err: any) {
      toast.error(err?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verifying OTP
  const handleOTPSubmit = async () => {
    const entered = otp.join("");
    if (entered.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    setIsOtpLoading(true);
    try {
      const res = await verifyOTP(entered);
      if (res?.payload) {
        toast.success("OTP Verified");
        navigate("/dashboard");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error("Verification failed");
    } finally {
      setIsOtpLoading(false);
    }
  };

  // ------------------------------------------------------
  // ✅ NEW: OTP Input Logic (Auto Forward, Backspace, Paste)
  // ------------------------------------------------------

  const handleOtpChange = (index: number, value: string) => {
    if (!value) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    // If user pastes whole OTP or multiple digits
    if (value.length > 1) {
      const incoming = value.replace(/\D/g, "").split("").slice(0, 6);
      const newOtp = [...otp];

      incoming.forEach((digit, i) => {
        if (index + i < 6) newOtp[index + i] = digit;
      });

      setOtp(newOtp);

      const next = Math.min(index + incoming.length, 5);
      otpInputsRef.current[next]?.focus();
      return;
    }

    // Standard single digit
    if (!/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5) otpInputsRef.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        if (index > 0) otpInputsRef.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }

    if (e.key === "ArrowLeft" && index > 0) otpInputsRef.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) otpInputsRef.current[index + 1]?.focus();
  };

  const resendOTP = async () => {
    try {
      setIsLoading(true);
      await sendOTP(debouncedFullNumber, window.recaptchaVerifier);
      toast.success("OTP resent");
    } catch (e) {
      toast.error("Failed to resend");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-tr from-yellow-500 via-slate-700 to-blue-950 bg-center min-h-screen flex flex-col justify-start">
      <div className="flex justify-center items-start min-h-screen pt-8 ">
        <div className="shadow-xl h-auto flex flex-col lg:flex-row bg-white rounded-[24px] w-full max-w-[1000px] relative">

          {/* LEFT */}
          <div className="relative flex flex-col items-center justify-center flex-1 lg:w-1/2 p-6 md:p-12">

            {otpScreen ? (
              <div className="w-full flex flex-col items-center justify-center gap-6 mt-4">
                <h2 className="text-2xl font-bold text-gray-800">Verify Your Phone Number</h2>
                <p className="text-gray-500">We've sent an OTP to your phone</p>

                <div className="flex space-x-2 justify-center mt-4">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpInputsRef.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(e, i)}
                      className="w-12 h-12 border border-gray-300 rounded-lg text-center text-2xl text-gray-800 
                                 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ))}
                </div>

                <button
                  className="mt-6 w-[85%] bg-orange-600 text-white py-2 px-4 rounded-full text-sm font-semibold"
                  onClick={handleOTPSubmit}
                  disabled={isOtpLoading}
                >
                  {isOtpLoading ? "Verifying..." : "Confirm OTP"}
                </button>

                <p className="text-gray-600 text-sm mt-4">
                  Didn’t receive the OTP?{" "}
                  <button onClick={resendOTP} className="text-blue-500 hover:underline">
                    {isLoading ? "Resending..." : "Resend"}
                  </button>
                </p>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center justify-center gap-6 mt-4">

                <h2 className="text-xl md:text-xl font-bold">LegalDhara Securities</h2>
                <p className="text-base font-semibold text-gray-500">
                  Workspace to maintain LegalDhara Organization ⚡️
                </p>

                <div className="flex flex-col gap-1 w-[85%]">
                  <div className="flex border border-gray-300 rounded mt-2.5 text-sm overflow-hidden">
                    <select
                      className="p-2 bg-white"
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                    >
                      {countryCodes.map((code) => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={phoneNumber}
                      onBlur={validatePhoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                      className="p-2 flex-1"
                    />
                  </div>

                  {phoneError && (
                    <span className="text-red-500 text-xs">{phoneError}</span>
                  )}
                </div>

                <button
                  className="w-[85%] flex justify-center text-sm bg-yellow-500 text-white py-2 px-4 rounded-full"
                  onClick={handleGetStarted}
                  disabled={isLoading || loading}
                >
                  {isLoading || loading ? "Sending..." : "Login"}
                </button>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex-1 rounded-r-[24px] bg-white overflow-hidden">
            <Lottie animationData={animation} loop autoplay className="w-full h-[40em]" />
          </div>
        </div>
      </div>

      <div id="recaptcha-container" />
    </div>
  );
};

export default Login;
