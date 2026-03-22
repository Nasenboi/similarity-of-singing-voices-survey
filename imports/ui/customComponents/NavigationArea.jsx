import {Button} from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {useIsAdmin, useIsAdminOrCompleted} from "@/imports/api/users/hooks";
import React from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

export function NavigationArea() {
  const isAdminOrCompleted = useIsAdminOrCompleted();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();
  const {t} = useTranslation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("Sidebar.Navigation.navigation")}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => navigate("/")}>{t("Sidebar.Navigation.home")}</SidebarMenuButton>
            <SidebarMenuButton onClick={() => navigate("/survey")}>{t("Sidebar.Navigation.survey")}</SidebarMenuButton>
            {useIsAdminOrCompleted && (
              <SidebarMenuButton onClick={() => navigate("/plot")}>
                {t("Sidebar.Navigation.similarityPlot")}
              </SidebarMenuButton>
            )}
            {isAdmin && (
              <>
                <SidebarMenuButton onClick={() => navigate("/songs")}>{t("Collections.songs")}</SidebarMenuButton>
                <SidebarMenuButton onClick={() => navigate("/participants")}>
                  {t("Collections.participants")}
                </SidebarMenuButton>
                <SidebarMenuButton onClick={() => navigate("/questions")}>
                  {t("Collections.surveyQuestions")}
                </SidebarMenuButton>
                <SidebarMenuButton onClick={() => navigate("/answers")}>{t("Collections.surveyAnswers")}</SidebarMenuButton>
              </>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
