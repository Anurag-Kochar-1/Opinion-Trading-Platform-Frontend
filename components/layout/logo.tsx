import Link from "next/link";
import React from "react";

export const Logo = () => {
  return (
    <Link
      href={"/"}
      className="flex justify-center items-center w-min gap-2"
    >
      <div className="aspect-square size-8 bg-primary rounded-full"></div>
      <h1 className="font-semibold">Probo</h1>
    </Link>
  );
};
