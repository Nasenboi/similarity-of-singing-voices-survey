import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useIsLoggedIn} from "@/imports/api/users/hooks";
import {zodResolver} from "@hookform/resolvers/zod";
import {Meteor} from "meteor/meteor";
import React, {useEffect} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {AutoField} from "../../customComponents/AutoField";
import {loginFormSchema} from "./loginSchema";

export function LoginPage() {
  const navigate = useNavigate();
  const isLoggedIn = useIsLoggedIn();

  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  function onSubmit(values) {
    Meteor.loginWithPassword(values.username, values.password);
  }

  return (
    <div className="w-screen h-screen max-w-screen max-h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>Enter your username and password below to login to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <AutoField form={form} name="username" label="Username" type="input" />
                <AutoField form={form} name="password" label="Password" type="password" />
                <div className="w-full flex justify-end">
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
