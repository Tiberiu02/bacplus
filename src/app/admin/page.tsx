"use client";

import { useEffect, useMemo, useState } from "react";
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
import { judetDupaCod } from "~/data/coduriJudete";
import { FaDotCircle, FaExternalLinkAlt } from "react-icons/fa";
import { LinkText } from "~/components/LinkText";
import { FaCamera, FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import ReactImageUploading, { ImageListType } from "react-images-uploading";
import { BeatLoader } from "react-spinners";
import { Table } from "~/components/Table";
import { unidecode } from "~/data/unidecode";

export default function Admin() {
  const [jwt] = useAtom(userDataAtom);

  if (!jwt) {
    return <LoginScreen />;
  } else {
    return <Dashboard />;
  }
}

function LoadingSpinner({
  color = "#bbb",
  size = 10,
  className,
}: {
  color?: string;
  size?: number;
  className?: string;
}) {
  return (
    <BeatLoader
      color={color}
      loading={true}
      size={size}
      aria-label="Se încarcă..."
      data-testid="loader"
      className={className}
    />
  );
}

function Institutie({
  id,
  cod_judet,
  nume,
  rank,
  website,
  sigla,
  sigla_xs,
  sigla_lg,
  sigla_lipsa,
  info_modificare,
}: {
  id: string;
  cod_judet: string;
  nume: string;
  rank: number | undefined;
  website: string | null;
  sigla: string | null;
  sigla_xs: boolean;
  sigla_lg: boolean;
  sigla_lipsa: boolean;
  info_modificare?: string;
}) {
  const judet = judetDupaCod(cod_judet);
  const [faraSigla, setFaraSigla] = useState(!!sigla_lipsa);
  const [isLoading, setIsLoading] = useState(false);

  const [images, setImages] = useState<ImageListType>(
    sigla
      ? [
          {
            dataURL: `https://assets.bacplus.ro/files/${sigla}`,
          },
        ]
      : []
  );
  const siglaMutation = trpc.sigle.upload.useMutation();
  const marcheazaFaraSigla = trpc.sigle.marcheazaFaraSigla.useMutation();
  const stergeSigla = trpc.sigle.delete.useMutation();
  const [uploaded, setUploaded] = useState<false | "xs" | "lg">(false);

  useEffect(() => {
    setFaraSigla(!!sigla_lipsa);
  }, [sigla_lipsa]);

  async function upload(dataUrl: string) {
    setIsLoading(true);
    try {
      const x = await siglaMutation.mutateAsync({
        id,
        dataUrl: dataUrl || "",
      });
      setIsLoading(false);
      setUploaded(x);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      setImages([]);
    }
  }

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);

    if (imageList.length == 1) {
      void upload(imageList[0]?.dataURL || "");
    } else if (imageList.length == 0) {
      setUploaded(false);
    }
  };

  const image = images[0];

  return (
    <div className="flex flex-row gap-4 border-b-[1px] border-gray-200 pb-6 pt-2">
      <ReactImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={1}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          <div className="flex select-none flex-col gap-1">
            <div
              className={twMerge(
                "relative flex h-48 w-48 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 p-1 [&>*]:pointer-events-none",
                !image && !isLoading && "cursor-pointer"
              )}
              onClick={!image && !isLoading ? onImageUpload : undefined}
              {...(!image && !isLoading ? dragProps : {})}
            >
              {isLoading ? (
                <LoadingSpinner />
              ) : isDragging ? (
                <FaCamera className="text-4xl text-gray-500" />
              ) : image ? (
                <>
                  <img
                    src={image.dataURL}
                    className="h-full w-full object-scale-down"
                  />
                </>
              ) : (
                <>
                  <FaPlus className="mb-2 text-2xl text-gray-500" />
                  <span className="text-center  text-gray-600 [text-wrap:balance]">
                    Adaugă sigla
                  </span>
                </>
              )}
            </div>
            {image && !isLoading && (
              <button
                className="flex items-center justify-center gap-1 text-base font-semibold text-red-500"
                onClick={() => {
                  onImageRemoveAll();
                  stergeSigla.mutate({ id });
                }}
              >
                <IoClose className="text-xl" />
                Șterge
              </button>
            )}
          </div>
        )}
      </ReactImageUploading>
      <div className="flex flex-col">
        <div className="mb-2 font-semibold">
          {rank || "?"}. {nume}{" "}
          <span className="font-normal">
            ({judet.numeIntreg}), {id}.
          </span>
          {faraSigla || sigla_lg || uploaded ? (
            <div className="ml-4 inline font-medium text-green-500">
              <FaDotCircle className="mr-2 mt-[-2px] inline" />
              {sigla_lg || uploaded == "lg"
                ? "Siglă mare"
                : sigla_xs || uploaded == "xs"
                ? "Siglă mică"
                : "Fără siglă"}
            </div>
          ) : sigla_xs ? (
            <div className="ml-4 inline font-medium text-orange-500">
              <FaDotCircle className="mr-2 mt-[-2px] inline" />
              Siglă prea mică
            </div>
          ) : (
            <div className="ml-4 inline font-medium text-red-500">
              <FaDotCircle className="mr-2 mt-[-2px] inline" />
              Fără siglă
            </div>
          )}
        </div>
        <LinkText
          href={
            "https://google.com/search?tbm=isch&q=" +
            encodeURIComponent(nume + " " + judet.numeIntreg + " sigla")
          }
          target="_blank"
        >
          <FaExternalLinkAlt className="mr-2 mt-[-2px] inline" />
          Caută siglă pe Google
        </LinkText>
        <LinkText
          href={
            "https://www.bing.com/images/search?q=" +
            encodeURIComponent(nume + " " + judet.numeIntreg + " sigla")
          }
          target="_blank"
        >
          <FaExternalLinkAlt className="mr-2 mt-[-2px] inline" />
          Caută siglă pe Bing
        </LinkText>
        {website && (
          <LinkText href={website} target="_blank">
            <FaExternalLinkAlt className="mr-2 mt-[-2px] inline" />
            {website.replace(/https?:\/\//, "").replace(/\/$/, "")}
          </LinkText>
        )}
        <button
          className={twMerge(
            "mt-2 flex cursor-pointer items-center gap-2 font-medium",
            !faraSigla && "opacity-50"
          )}
          onClick={() => {
            setFaraSigla(!faraSigla);
            marcheazaFaraSigla.mutate({ id, faraSigla: !faraSigla });
          }}
        >
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={faraSigla}
            readOnly
          />
          {sigla_xs ? "Fără siglă mai mare" : "Fără siglă"}
        </button>
        {info_modificare && (
          <div className="mt-2 text-sm opacity-50">
            Ultima modificare: {info_modificare}
          </div>
        )}
      </div>
    </div>
  );
}

function obtainKey(s: string) {
  return unidecode(s)
    .toLowerCase()
    .replace(/[^\w\d]/g, "");
}

function Dashboard() {
  const stats = trpc.stats.useQuery();
  const data = trpc.sigle.institutii.useQuery(undefined, {
    staleTime: Infinity,
  });
  const [page, setPage] = useState<"lipsa" | "complet">("lipsa");

  const [filter, setFilter] = useState<string>("");

  const dataWithKey = useMemo(
    () =>
      data.data &&
      data.data.map((i) => ({
        ...i,
        filterKey: obtainKey(i.nume),
      })),
    [data.data]
  );

  const onFilterChange = (value: string) => {
    setFilter(obtainKey(value));
    console.log(value, obtainKey(value));
  };

  const filteredData = useMemo(
    () =>
      dataWithKey && dataWithKey.filter((i) => i.filterKey.includes(filter)),
    [dataWithKey, filter]
  );

  return (
    <MainContainer>
      <Title>Contribuții</Title>

      <div className="flex flex-col gap-2">
        {stats.data ? (
          <Table
            columns={[
              {
                header: "Loc",
                type: "number",
                value: (rowData, rowIndex) => rowIndex + 1,
                decimals: 0,
              },
              {
                header: "Nume",
                type: "text",
                value: (rowData) => rowData.name,
              },
              {
                header: "Sigle",
                type: "number",
                value: (rowData) => rowData.count,
                decimals: 0,
                sortable: true,
                primarySortOrder: "DESC",
                defaultSortingColumn: true,
              },
            ]}
            data={stats.data.leaderboard}
            searchable={false}
          />
        ) : (
          <LoadingSpinner className="mx-auto" />
        )}
      </div>

      <Title>Adăugare sigle</Title>

      <div className="flex w-full select-none justify-center gap-4 pb-8">
        <div
          className={twMerge(
            "border-collapse cursor-pointer border-b-2 px-1 pb-2 text-center font-semibold",
            page === "lipsa" ? "border-black" : "border-transparent"
          )}
          onClick={() => setPage("lipsa")}
        >
          Lipsă
        </div>
        <div
          className={twMerge(
            "border-collapse cursor-pointer border-b-2 px-1 pb-2 text-center font-semibold",
            page === "complet" ? "border-black" : "border-transparent"
          )}
          onClick={() => setPage("complet")}
        >
          Complet
        </div>
      </div>

      {filteredData ? (
        <>
          <TextInput
            placeHolder={"Caută instituție"}
            onChange={onFilterChange}
            Icon={FaMagnifyingGlass}
          />
          {(page == "lipsa"
            ? filteredData
                .filter((i) => !i.sigla_lipsa && !i.sigla_lg)
                .sort(
                  (a, b) =>
                    (a.rankLiceu ?? (a.rankGimnaziu ?? 100000) * 5) -
                    (b.rankLiceu ?? (b.rankGimnaziu ?? 100000) * 5)
                )
            : filteredData
                .filter((i) => i.sigla_lg || i.sigla_lipsa)
                .sort((a, b) => b.ultima_modificare - a.ultima_modificare)
          )
            .slice(0, 100)
            .map((i) => (
              <Institutie
                key={i.id}
                id={i.id}
                cod_judet={i.cod_judet}
                nume={i.nume}
                rank={i.rankLiceu ?? i.rankGimnaziu}
                website={i.website}
                sigla={i.sigla}
                sigla_xs={i.sigla_xs}
                sigla_lg={i.sigla_lg}
                sigla_lipsa={i.sigla_lipsa}
                info_modificare={i.info_modificare}
              />
            ))}
        </>
      ) : (
        <LoadingSpinner className="mx-auto" />
      )}
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
