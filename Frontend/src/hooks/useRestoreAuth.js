import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "../api/user.api.js";
import { login } from "../store/slices/authSlice.js";

const useRestoreAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    getCurrentUser()
      .then(user => {
        if (user) dispatch(login(user));
      })
      .catch(() => {
      });
  }, [dispatch]);
};

export default useRestoreAuth;
