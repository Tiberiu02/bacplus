"use client";

import { useState } from "react";
import { VscKey } from "react-icons/vsc";
import { FiUser } from "react-icons/fi";
import { MainContainer } from "~/components/MainContainer";
import { TextInput } from "~/components/TextInput";
import { Title } from "~/components/Title";
import { Button } from "~/components/Button";
import { trpc } from "~/utils/trpc";

import { useAtom } from "jotai";
import { BiSolidError } from "react-icons/bi";
import { twMerge } from "tailwind-merge";
import { userDataAtom } from "./userData";

export default function Admin() {
  const [jwt] = useAtom(userDataAtom);

  if (!jwt) {
    return <LoginScreen />;
  } else {
    return <Dashboard />;
  }
}

function Dashboard() {
  return (
    <MainContainer>
      <p className="mt-24 text-center text-xl">Te-ai conectat cu succes!</p>
      <p className="mt-2 text-center text-xl">
        În curând, aici vom putea administra toate datele BacPlus.
      </p>
    </MainContainer>
  );
}

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [jwt, setJwt] = useAtom(userDataAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const utils = trpc.useUtils();

  const login = async () => {
    setLoading(true);
    setError("");
    const resp = await utils.login.fetch({ email, password });
    setLoading(false);

    if (resp.error) {
      setError(resp.error);
    } else if (resp.user) {
      setJwt(resp.user);
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
