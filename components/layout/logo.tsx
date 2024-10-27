import Image from "next/image";
import Link from "next/link";
import React from "react";

export const Logo = () => {
  return (
    <Link href={"/"}>
      <Image src={"/images/logo.avif"} alt="logo" width={128} height={75} />
    </Link>
  );
};
