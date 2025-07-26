import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaStethoscope,
  FaRupeeSign,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

const MyAppointments = () => {
  const { BACKEND_URL, token, getAvailableDoctors } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePayment = async (appointmentId) => {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/api/user/payment-razorpay`,
            { appointmentId },
            { headers: { 'token': token } }
        );

        if (response.data.success) {
            const { order } = response.data;
            
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Doctor Appointment",
                description: "Payment for Doctor Consultation",
                order_id: order.id,
                handler: async function (paymentResponse) {
                    console.log('Payment Response:', paymentResponse);
                    
                    try {
                        const verifyResponse = await axios.post(
                            `${BACKEND_URL}/api/user/verify-payment`,
                            {
                                appointmentId,
                                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                                razorpay_order_id: paymentResponse.razorpay_order_id,
                                razorpay_signature: paymentResponse.razorpay_signature
                            },
                            { headers: { 'token': token } }
                        );

                        if (verifyResponse.data.success) {
                            toast.success('Payment successful!');
                            getUserAppointments();
                        } else {
                            toast.error(verifyResponse.data.message || 'Payment verification failed');
                        }
                    } catch (error) {
                        console.error('Verification error:', error);
                        toast.error(error.response?.data?.message || 'Payment verification failed');
                    }
                },
                prefill: {
                    name: "Patient Name",
                    email: "patient@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#3B82F6"
                },
                modal: {
                    ondismiss: function() {
                        toast.info('Payment cancelled');
                    }
                }
            };

            if (!window.Razorpay) {
                toast.error('Payment gateway not loaded. Please refresh the page.');
                return;
            }

            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error('Payment error:', error);
        toast.error(error.response?.data?.message || 'Payment initiation failed');
    }
  };

  const getUserAppointments = async () => {
    if (!token) {
      toast.error('Please login to view appointments');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/user/my-appointments`, {
        headers: { 'token': token }
      });

      if (response.data.success) {
        console.log(response.data.data);
        setAppointments(response.data.data);
        getAvailableDoctors()
        setError('');
      } else {
        setError(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to fetch appointments');
      toast.error(error.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { 'token': token } }
      );
      if (response.data.success) {
        toast.success('Appointment cancelled successfully');
        getUserAppointments(); 
        getAvailableDoctors()
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel appointment');
    }
  };

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isUpcoming = (dateString) => {
    const [day, month, year] = dateString.split('-');
    const appointmentDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointmentDate >= today;
  };

  useEffect(() => {
    getUserAppointments();
  }, [token]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse">
          <div className="flex space-x-4">
            <div className="rounded-full bg-gray-300 h-12 w-12"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Appointments</h1>
        <p className="text-gray-600">Manage your upcoming and past appointments</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <FaTimesCircle className="text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && appointments.length === 0 && (
        <div className="text-center py-16">
          <div className="mb-8">
            <FaCalendarAlt className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Appointments Found
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              You haven't booked any appointments yet. Browse our qualified doctors and book your first appointment.
            </p>
            <button
              onClick={() => navigate('/doctors')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <FaStethoscope className="inline mr-2" />
              Book an Appointment
            </button>
          </div>
        </div>
      )}

      {/* Appointments list */}
      {appointments.length > 0 && (
        <div className="space-y-6">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className={`bg-white rounded-xl shadow-md border transition-all duration-200 hover:shadow-lg ${
                appointment.cancelled 
                  ? 'border-red-200 bg-red-50' 
                  : appointment.isCompleted
                  ? 'border-green-200 bg-green-50'
                  : isUpcoming(appointment.slotDate)
                  ? 'border-blue-200'
                  : 'border-gray-200'
              }`}
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Doctor Info */}
                  <div className="flex items-center gap-4 lg:flex-1">
                    <img
                      src={appointment.docData.image}
                      alt={appointment.docData.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-blue-100"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">
                        {appointment.docData.name}
                      </h3>
                      <p className="text-blue-600 font-medium mb-1">
                        <FaStethoscope className="inline mr-1" />
                        {appointment.docData.speciality}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {appointment.docData.degree} • {appointment.docData.experience}
                      </p>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="lg:flex-1 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center text-gray-700">
                        <FaCalendarAlt className="text-blue-500 mr-2" />
                        <div>
                          <p className="font-medium">{formatDate(appointment.slotDate)}</p>
                          <p className="text-sm text-gray-500">{appointment.slotDate}</p>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <FaClock className="text-green-500 mr-2" />
                        <div>
                          <p className="font-medium">{appointment.slotTime}</p>
                          <p className="text-sm text-gray-500">Appointment Time</p>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <FaRupeeSign className="text-yellow-500 mr-2" />
                        <div>
                          <p className="font-medium">₹{appointment.amount}</p>
                          <p className="text-sm text-gray-500">Consultation Fee</p>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <FaMapMarkerAlt className="text-red-500 mr-2" />
                        <div>
                          <p className="font-medium text-sm">
                            {appointment.docData.address.line1}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appointment.docData.address.line2}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="lg:w-48 flex flex-col justify-between">
                    {/* Status Badge - Updated to properly show isCompleted */}
                    <div className="mb-4">
                      {appointment.cancelled ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          <FaTimesCircle className="mr-1" />
                          Cancelled
                        </span>
                      ) : appointment.isCompleted ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          <FaCheckCircle className="mr-1" />
                          Completed
                        </span>
                      ) : appointment.payment ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          <FaCheckCircle className="mr-1" />
                          Paid
                        </span>
                      ) : isUpcoming(appointment.slotDate) ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          <FaClock className="mr-1" />
                          Upcoming
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                          <FaTimesCircle className="mr-1" />
                          Expired
                        </span>
                      )}
                    </div>

                    {/* Action Buttons - Updated to exclude completed appointments */}
                    <div className="space-y-2">
                      {!appointment.cancelled && !appointment.isCompleted && isUpcoming(appointment.slotDate) && (
                        <>
                          {!appointment.payment && (
                            <button 
                              onClick={() => handlePayment(appointment._id)} 
                              className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                              Pay Online
                            </button>
                          )}
                          <button
                            onClick={() => cancelAppointment(appointment._id)}
                            className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                          >
                            <FaTimes className="inline mr-1" />
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Booking Info */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Booked on: {new Date(appointment.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {appointments.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/doctors')}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <FaStethoscope className="inline mr-2" />
            Book Another Appointment
          </button>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
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

export default MyAppointments;
