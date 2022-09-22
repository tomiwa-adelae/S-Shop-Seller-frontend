import Link from 'next/link';
import React, { useState, useCallback, useEffect } from 'react';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { registerUser } from '../../store/actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/router';
import { SmallWhiteSpinner } from '../Spinner';
import { ErrorMessageBox } from '../MessageBox';

const RegisterForm = () => {
   const dispatch = useDispatch();
   const router = useRouter();

   const [firstName, setFirstName] = useState('');
   const [lastName, setLastName] = useState('');
   const [email, setEmail] = useState('');
   const [phoneNumber, setPhoneNumber] = useState('');
   const [brandName, setBrandName] = useState('');
   const [brandLogo, setBrandLogo] = useState(
      'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
   );
   const [accountNumber, setAccountNumber] = useState('');
   const [bankName, setBankName] = useState('');
   const [nameOfAccountHolder, setNameOfAccountHolder] = useState('');
   const [password, setPassword] = useState('');
   const [retypePassword, setRetypePassword] = useState('');
   const [showPassword1, setShowPassword1] = useState(false);
   const [showPassword2, setShowPassword2] = useState(false);

   const userState = useSelector((state) => state.register);
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

   const onDrop = useCallback((acceptedFiles) => {
      acceptedFiles.forEach((file) => {
         const reader = new FileReader();

         reader.readAsDataURL(file);
         reader.onload = () => {
            const binaryStr = reader.result;

            setBrandLogo(binaryStr);
         };
      });
   }, []);

   const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
   });

   const handleSubmit = (e) => {
      e.preventDefault();

      dispatch(
         registerUser({
            firstName,
            lastName,
            email,
            phoneNumber,
            brandLogo,
            brandName,
            accountNumber,
            bankName,
            nameOfAccountHolder,
            password,
            retypePassword,
         })
      );
   };

   return (
      <div className="register-form section">
         <div className="container">
            <div className="head py-1">
               <h4>S-SHOP Seller</h4>
            </div>
            <div className="intro">
               <p className="lead">
                  Create a S-Shop seller account. |{' '}
                  <Link href="/login">
                     <span className="text-secondary">
                        Login to your seller account
                     </span>
                  </Link>
               </p>
            </div>
            <form onSubmit={handleSubmit}>
               <section className="box section">
                  <h6>Personal information</h6>

                  <div>
                     <input
                        type="text"
                        placeholder="First name *"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                     />
                  </div>
                  <div>
                     <input
                        type="text"
                        placeholder="Last name *"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                     />
                  </div>
                  <div>
                     <input
                        type="email"
                        placeholder="Email address *"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                     />
                  </div>
                  <div>
                     <input
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        type="number"
                        placeholder="Phone number *"
                     />
                  </div>
               </section>
               <section className="box section-small">
                  <h6>Brand information</h6>
                  <div>
                     <input
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        type="text"
                        placeholder="Brand name (Optional)"
                     />
                  </div>
                  <div>
                     <label>Brand logo (Optional)</label>
                  </div>
                  <div className="preview-file">
                     {brandLogo && (
                        <>
                           <div>
                              <img src={brandLogo} alt="" />
                           </div>
                           <span className="btn btn-secondary m-0">
                              <label htmlFor="logo">Change logo</label>
                           </span>
                           <span
                              onClick={() =>
                                 setBrandLogo(
                                    'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
                                 )
                              }
                              className="btn btn-danger my-0"
                           >
                              Delete
                           </span>
                        </>
                     )}
                  </div>
                  <div
                     {...getRootProps()}
                     className={isDragActive ? 'modal-active' : 'upload-modal'}
                  >
                     <div>
                        <input id="logo" {...getInputProps()} />
                     </div>

                     <small>Drap and drop or click to browse a file</small>
                  </div>
               </section>
               <section className="box section-small">
                  <h6>Payment information</h6>
                  <div>
                     <input
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        type="number"
                        placeholder="Account number *"
                     />
                  </div>
                  <div>
                     <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        name="bankName"
                        id="bankName"
                     >
                        <option value="">Select bank</option>
                        <option value="Access bank">Access Bank</option>
                        <option value="United bank of africa">
                           United bank of africa
                        </option>
                        <option value="First bank">first bank</option>
                        <option value="Zenith bank">Zenith bank</option>
                        <option value="Polaris bank">Polaris bank</option>
                     </select>
                  </div>
                  <div>
                     <input
                        value={nameOfAccountHolder}
                        onChange={(e) => setNameOfAccountHolder(e.target.value)}
                        type="text"
                        placeholder="Name of account holder *"
                     />
                  </div>
               </section>
               <section className="box section-small">
                  <h6>Login details</h6>
                  <div className="password">
                     <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword1 ? 'text' : 'password'}
                        placeholder="Password *"
                     />
                     <span onClick={() => setShowPassword1(!showPassword1)}>
                        {showPassword1 ? <FaEyeSlash /> : <FaEye />}
                     </span>
                  </div>
                  <div className="password">
                     <input
                        value={retypePassword}
                        onChange={(e) => setRetypePassword(e.target.value)}
                        type={showPassword2 ? 'text' : 'password'}
                        placeholder="Confirm password *"
                     />
                     <span onClick={() => setShowPassword2(!showPassword2)}>
                        {showPassword2 ? <FaEyeSlash /> : <FaEye />}
                     </span>
                  </div>
               </section>
               {msg && <ErrorMessageBox msg={msg} />}
               <div>
                  <button className="btn btn-primary">
                     {' '}
                     {loading ? <SmallWhiteSpinner /> : 'Register'}{' '}
                  </button>
               </div>
               <p className="my-1">
                  Already have a seller account?{' '}
                  <Link href="/login">
                     <strong className="text-secondary">
                        Login to your seller account
                     </strong>
                  </Link>
               </p>
            </form>
         </div>
      </div>
   );
};

export default RegisterForm;
