import React, { FC } from "react";
import { Redirect } from "react-router-dom";

const OAuth2RedirectHandler: FC = () => {
  const url: Location = window.location;
  console.log(url);
  const clientId: string | null = new URLSearchParams(url.search).get("token");
  console.log(clientId);

  return <Redirect to="/account" />;
};

export default OAuth2RedirectHandler;
