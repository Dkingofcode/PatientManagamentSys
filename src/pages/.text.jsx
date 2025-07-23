  // const demoAccounts = [
  //   { role: 'Administrator', email: 'admin@hospital.com' },
  //   { role: 'Doctor', email: 'dr.smith@hospital.com' },
  //   { role: 'Lab Technician', email: 'lab.tech@hospital.com' },
  //   { role: 'Front Desk (Sarah)', email: 'sarah.johnson@hospital.com' },
  //   { role: 'Front Desk (Mike)', email: 'mike.wilson@hospital.com' },
  //   { role: 'Front Desk (Lisa)', email: 'lisa.brown@hospital.com' },
  //   { role: 'Patient', email: 'patient@email.com' },
  // ];






   {/* <div className="mb-12">
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16">
        {/* Logo and Branding */}
          {/* <div className="flex items-center mb-6">
            <div className="bg-blue-600 p-3 rounded-lg mr-4">
              <Stethoscope size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MedCare Pro</h1>
              <p className="text-gray-600 text-sm">Healthcare Management System</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Streamline Your Healthcare Operations
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Secure, efficient, and user-friendly platform for managing patients, 
              tests, and medical records with role-based access control.
            </p>
          </div>
        </div> */}

        {/* Demo Accounts Section */}
        {/* <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Accounts</h3>
          <div className="space-y-3">
            {demoAccounts.map((account, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">{account.role}:</span>
                <button
                  onClick={() => {
                    setEmail(account.email);
                    setPassword('password');
                  }}
                  className="text-blue-600 hover:text-blue-800 font-mono text-sm hover:underline"
                >
                  {account.email}
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 border-t pt-3">
            Password for all accounts: <span className="font-mono bg-gray-100 px-1 rounded">password</span>
          </p>
        </div>
      </div> */} 










// login


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import { Stethoscope } from 'lucide-react';

// function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const success = await login(email, password);
//       if (success) {
//         // Redirect based on role
//         const roleRoutes = {
//           'front-desk': '/front-desk',
//           'doctor': '/doctor',
//           'lab-technician': '/lab-technician',
//           'admin': '/admin',
//           'patient': '/patient',
//         };
        
//         // Get user role from localStorage (set during login)
//         const user = JSON.parse(localStorage.getItem('user') || '{}');
//         navigate(roleRoutes[user.role as keyof typeof roleRoutes]);
//       } else {
//         setError('Invalid email or password');
//       }
//     } catch (err) {
//       setError('An error occurred. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Left Column - Branding and Demo Accounts */}
       

//       {/* Right Column - Login Form */}
//       <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 bg-white">
//         <div className="max-w-md w-full mx-auto">
//           <div className="mb-8">
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
//             <p className="text-gray-600">Please sign in to your account</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="doctor@hospital.com"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   id="password"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="••••••••"
//                 />
//               </div>
//             </div>

//             {error && (
//               <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
//                 {error}
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               {loading ? 'Signing In...' : 'Sign In'}
//             </button>
//           </form>

//           <div className="mt-8 text-center">
//             <p className="text-sm text-gray-600">
//               Need help? Contact IT Support at{' '}
//               <a href="mailto:support@hospital.com" className="text-blue-600 hover:text-blue-800">
//                 support@hospital.com
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;




