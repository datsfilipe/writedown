import Button from "../ui/Button";
import Link from "next/link";
import React from "react";

const HeroSection = () => {
  return (
    <div className="my-36 h-full w-full">
      <div className="flex h-full w-full flex-col items-center justify-center gap-20">
        <div className="flex flex-col items-center justify-center gap-5">
          <h1 className="flex flex-col gap-5 text-center text-6xl font-semibold text-slate-900">
            <span>Upgrade Your</span>
            <span>Note-Taking Game</span>
          </h1>
          <p className="max-w-2xl text-center font-medium text-slate-800">
            All your notes, synced on all your devices. Free, easy and fast.
          </p>
          <div>
            <Link href="/login">
              <Button>Try Now</Button>
            </Link>
          </div>
        </div>
        <img src="/screenshot.png" alt="Writedown Screenshot" />
      </div>
    </div>
  );
};

export default HeroSection;