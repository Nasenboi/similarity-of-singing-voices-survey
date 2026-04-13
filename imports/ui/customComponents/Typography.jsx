import {cn} from "@/lib/utils";
import React from "react";

// inspired by https://ui.shadcn.com/docs/components/radix/typography

export function H1({children, className}) {
  return (
    <h1 className={cn("scroll-m-20 text-center md:text-4xl text-3xl font-extrabold tracking-tight text-balance", className)}>
      {children}
    </h1>
  );
}

export function H2({children, className}) {
  return (
    <h2 className={cn("scroll-m-20 pb-2 md:text-3xl text-2xl font-semibold tracking-tight first:mt-0 ", className)}>
      {children}
    </h2>
  );
}

export function H3({children, className}) {
  return (
    <h3 className={cn("scroll-m-20 md:text-2xl text-xl font-semibold tracking-tight whitespace-nowrap ", className)}>
      {children}
    </h3>
  );
}

export function H4({children, className}) {
  return (
    <h4 className={cn("scroll-m-20 md:text-xl text-lg font-semibold tracking-tight whitespace-nowrap ", className)}>
      {children}
    </h4>
  );
}

export function P({children, className}) {
  return <p className={cn("leading-7 md:text-base text-sm whitespace-pre-line", className)}>{children}</p>;
}

export function Lead({children, className}) {
  return <p className={cn("md:text-xl text-lg text-muted-foreground ", className)}>{children}</p>;
}

export function Large({children, className}) {
  return <div className={cn("md:text-lg font-semibold ", className)}>{children}</div>;
}

export function Small({children, className}) {
  return <small className={cn("md:text-sm text-xs leading-none font-medium ", className)}>{children}</small>;
}

export function Muted({children, className}) {
  return <p className={cn("md:text-sm text-xs text-muted-foreground ", className)}>{children}</p>;
}
