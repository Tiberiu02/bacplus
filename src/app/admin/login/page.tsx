"use client";

import { trpc } from "~/utils/trpc";
import { FiUser } from "react-icons/fi";
import { useAtom } from "jotai";
import { useState } from "react";
import { MainContainer } from "~/components/MainContainer";
import { Title } from "~/components/Title";
import { TextInput } from "~/components/TextInput";
import { VscKey } from "react-icons/vsc";
import { Button } from "~/components/Button";
import { twMerge } from "tailwind-merge";
import { BiSolidError } from "react-icons/bi";
import { useRouter } from "next/navigation";
import { useUserData } from "../userData";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [jwt, setJwt] = useUserData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const utils = trpc.useUtils();

  const router = useRouter();

  const login = async () => {
    setLoading(true);
    setError("");
    const resp = await utils.login.fetch({ email, password });
    setLoading(false);

    if (resp.error) {
      setError(resp.error);
    } else if (resp.user) {
      console.log("Logged in as", resp.user);
      setJwt(resp.user);
      router.push("/admin");
    }
  };

  return (
    <MainContainer>
      <Title>Bun venit!</Title>
      <div className="flex max-w-xs flex-col items-center gap-2 self-center">
        <TextInput placeHolder="Email" onChange={setEmail} Icon={FiUser} />
        <TextInput
          placeHolder="Parolă"
          onChange={setPassword}
          Icon={VscKey}
          type="password"
        />
        <Button className="mt-8 w-32" onClick={() => void login()}>
          Conectare
        </Button>
        <div
          className={twMerge(
            "flex items-center gap-2 font-semibold text-red-500",
            !error && "hidden"
          )}
        >
          <BiSolidError /> {error}
        </div>
      </div>
    </MainContainer>
  );
}
