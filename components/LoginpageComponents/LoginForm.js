import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { loginUser } from '../../store/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { ErrorMessageBox } from '../MessageBox';
import { SmallWhiteSpinner } from '../Spinner';

const LoginForm = () => {
   const dispatch = useDispatch();
   const router = useRouter();

   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);

   const userState = useSelector((state) => state.login);
   const { loading, user } = userState;

   const errorState = useSelector((state) => state.error);
   const { msg } = errorState;

   useEffect(() => {
      const redirect = router.query.redirect
         ? router.query.redirect
         : '/dashboard';

      if (user) {
         router.push(redirect);
      }
   }, [user, router, dispatch]);

   const handleSubmit = (e) => {
      e.preventDefault();

      dispatch(loginUser({ email, password }));
   };

   return (
      <div className="login-form section">
         <div className="container">
            <div className="head py-1">
               <h4>S-SHOP Seller</h4>
            </div>
            <div className="intro">
               <p className="lead">
                  Login to your S-SHOP seller account |{' '}
                  <Link href="/register">
                     <span className="text-secondary">
                        Create a seller account now
                     </span>
                  </Link>
               </p>
            </div>
            <form onSubmit={handleSubmit}>
               <div>
                  <input
                     type="email"
                     placeholder="Email address"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                  />
               </div>
               <div className="password">
                  <input
                     type={showPassword ? 'text' : 'password'}
                     placeholder="Password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                  />
                  <span onClick={() => setShowPassword(!showPassword)}>
                     {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
               </div>
               <Link className="my-1 text-secondary" href="/forgotpassword">
                  Forgotten password?
               </Link>
               {msg && <ErrorMessageBox msg={msg} />}
               <div>
                  <button className="btn btn-primary">
                     {loading ? <SmallWhiteSpinner /> : 'Login'}{' '}
                  </button>
               </div>
               <p className="my-1">
                  Do not have a seller account?{' '}
                  <Link href="/register">
                     <strong className="text-secondary">
                        Create a seller account
                     </strong>
                  </Link>
               </p>
            </form>
         </div>
      </div>
   );
};

export default LoginForm;
