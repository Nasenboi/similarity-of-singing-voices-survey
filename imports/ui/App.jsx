import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./contextProvider/ThemeProvider";
import { RoutedContentArea } from "./RoutedContentArea";

export const App = () => {
  return (
    <div className="max-w-3xl min-h-screen mx-auto sm:pt-10">
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <ToastContainer />
        <BrowserRouter><RoutedContentArea /></BrowserRouter>
      </ThemeProvider>
    </div>
  );
};
