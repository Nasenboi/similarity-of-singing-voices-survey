import React from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { NotFoundPage } from "./pages/notFound/notFoundPage";
import { MainPage } from "./pages/main/mainPage";

export function RoutedContentArea() {
    return (
        <Routes>
            <Route path={"/"} element={<MainPage />} />
            <Route path={"*"} element={<NotFoundPage />} />
        </Routes>
    );
}
