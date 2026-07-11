import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ServerUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [message, setMessage] = useState('Processing payment...');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get('session_id');
    if (!sessionId) {
      setMessage('Missing session id');
      return;
    }

    axios
      .post(
        ServerUrl + '/api/payment/verify',
        { sessionId },
        { withCredentials: true }
      )
      .then((res) => {
        dispatch(setUserData(res.data.user));
        setMessage('Payment successful! Credits added.');
        setTimeout(() => navigate('/'), 2500);
      })
      .catch((err) => {
        setMessage(
          'Verification failed: ' +
            (err.response?.data?.message || err.message)
        );
      });
  }, [location.search, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h2 className="text-xl font-medium">{message}</h2>
    </div>
  );
}

export default PaymentSuccess;
