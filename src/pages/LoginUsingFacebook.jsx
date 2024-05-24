import React, { useEffect } from "react";
import FacebookLogin from "react-facebook-login";
import { useDispatch } from "react-redux";
import { loginFacebookApiAction } from "../redux/Reducers/UserReducer";

const LoginUsingFacebook = () => {
  const dispatch = useDispatch();
  const responseFacebook = async (response) => {
    const action = loginFacebookApiAction(response)
    dispatch(action)
  };
  return (
    <div className="facebook-login">
      <FacebookLogin
        appId="752321323268829"
        autoLoad={false}
        fields="name,email,picture"
        callback={responseFacebook}
        textButton={<i className="fa-brands fa-facebook-f"></i>}
        size="small"
        buttonStyle={{borderRadius: "17%"}}
      />
    </div>
  );
};

export default LoginUsingFacebook;
