import React from "react";

// inspired by https://ui.shadcn.com/docs/components/radix/typography

export function H1({children, className}) {
  return (
    <h1 className={"scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance " + className}>
      {children}
    </h1>
  );
}

export function H2({children, className}) {
  return <h2 className={"scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 " + className}>{children}</h2>;
}

export function H3({children, className}) {
  return <h3 className={"scroll-m-20 text-2xl font-semibold tracking-tight " + className}>{children}</h3>;
}

export function H4({children, className}) {
  return <h4 className={"scroll-m-20 text-xl font-semibold tracking-tight " + className}>{children}</h4>;
}

export function P({children, className}) {
  return <p className={"leading-7 not-first:mt-6 " + className}>{children}</p>;
}

export function Lead({children, className}) {
  return <p className={"text-xl text-muted-foreground " + className}>{children}</p>;
}

export function Large({children, className}) {
  return <div className={"text-lg font-semibold " + className}>{children}</div>;
}

export function Small({children, className}) {
  return <small className={"text-sm leading-none font-medium " + className}>{children}</small>;
}

export function Muted({children, className}) {
  return <p className={"text-sm text-muted-foreground " + className}>{children}</p>;
}
