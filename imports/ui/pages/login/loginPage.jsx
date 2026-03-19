import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {PasswordInput} from "@/components/ui/password-input";
import {zodResolver} from "@hookform/resolvers/zod";
import {Meteor} from "meteor/meteor";
import React from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import * as z from "zod";
import {FieldWrapper} from "../../customComponents/FieldWrapper";
import {loginFormSchema} from "./loginSchema";

export function LoginPage() {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values) {
    Meteor.loginWithPassword(values.username, values.password);
    navigate("/");
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
                <FieldWrapper form={form} name="username" label="Username">
                  {({field, fieldState}) => <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />}
                </FieldWrapper>
                <FieldWrapper form={form} name="password" label="Password">
                  {({field, fieldState}) => <PasswordInput {...field} id={field.name} aria-invalid={fieldState.invalid} />}
                </FieldWrapper>
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
