import React from "react";

// inspired by https://ui.shadcn.com/docs/components/radix/typography

export function H1({children}) {
  return <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">{children}</h1>;
}

export function H2({children}) {
  return <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">{children}</h2>;
}

export function H3({children}) {
  return <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{children}</h3>;
}

export function H4({children}) {
  return <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">{children}</h4>;
}

export function P({children}) {
  return <p className="leading-7 not-first:mt-6">{children}</p>;
}

export function Lead({children}) {
  return <p className="text-xl text-muted-foreground">{children}</p>;
}

export function Large({children}) {
  return <div className="text-lg font-semibold">{children}</div>;
}

export function Small({children}) {
  return <small className="text-sm leading-none font-medium">{children}</small>;
}

export function Muted({children}) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}
