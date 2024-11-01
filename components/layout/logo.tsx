import Link from "next/link";
import React from "react";

export const Logo = () => {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-base font-bold text-primary transition-colors hover:text-primary/80 md:text-xl"
    >
      <span
        className="text-base md:text-xl"
        role="img"
        aria-label="Money with wings emoji"
      >
        💸
      </span>
      <h1 className="tracking-tight">Opinion Trading</h1>
    </Link>
  );
};
