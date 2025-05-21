import React from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/authSlice'
import { useNavigate } from 'react-router-dom'
import Button from './Button'
  import { ToastContainer, toast } from 'react-toastify';
function LogoutBtn() {
    const notify = () => toast("Wow so easy!");
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handlelogout = () => {
        try {
            dispatch(logout());
            // No need to manually remove token as the logout thunk already does this
            navigate('/login');
        } catch (error) {
            console.error("Logout error:", error);
        }
    }
    
    return (
        <Button
            onClick={handlelogout}
            className=""
        >
            Logout
            
        </Button>
    )
}

export default LogoutBtn