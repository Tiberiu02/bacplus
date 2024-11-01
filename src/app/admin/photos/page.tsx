"use client";

import { useMemo, useRef, useState } from "react";
import { FaDotCircle, FaExternalLinkAlt } from "react-icons/fa";
import { FaCamera, FaEarthAmericas, FaPlus, FaRegPaste } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import ReactImageUploading, { ImageListType } from "react-images-uploading";
import { twMerge } from "tailwind-merge";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { MainContainer } from "~/components/MainContainer";
import { TextInput } from "~/components/TextInput";
import { Title } from "~/components/Title";
import { getPhotoUrl, getRawFileUrl, getUrlSigla } from "~/utils/asset-urls";
import { trpc } from "~/utils/trpc";
import { MdDragIndicator } from "react-icons/md";

import { CSS } from "@dnd-kit/utilities";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  useSortable,
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { LinkText } from "~/components/LinkText";
import { judetDupaCod } from "~/data/coduriJudete";

export default function Dashboard() {
  const data = trpc.photos.institutii.useQuery(undefined, {
    staleTime: Infinity,
  });

  const schools = useMemo(() => {
    return data.data
      ?.sort(
        (a, b) =>
          (a.rankLiceu ?? (a.rankGimnaziu ?? 100000) * 5) -
          (b.rankLiceu ?? (b.rankGimnaziu ?? 100000) * 5)
      )
      .slice(0, 10);
  }, [data.data]);

  return (
    <MainContainer>
      <Title>Imagini</Title>
      {schools ? (
        schools.map((school) => <Institution key={school.id} {...school} />)
      ) : (
        <LoadingSpinner className="mx-auto" />
      )}
    </MainContainer>
  );
}

const MIN_PHOTOS = 3;
const SAVE_SOURCE_UPDATE_DELAY = 1000;

type PhotoType = {
  id: number;
  file_name: string;
  source: string | null;
  created_info: string;
  modified_info: string;
};

function Institution({
  photos,
  id,
  nume,
  website,
  cod_judet,
  sigla,
  ultima_modificare,
  rankLiceu,
  rankGimnaziu,
}: {
  photos: PhotoType[];
  id: string;
  nume: string;
  website: string | null;
  cod_judet: string;
  sigla: boolean;
  ultima_modificare: number;
  rankLiceu?: number | undefined;
  rankGimnaziu?: number | undefined;
}) {
  const rank = rankLiceu || rankGimnaziu;
  const judet = judetDupaCod(cod_judet);

  const [images, setImages] = useState<PhotoType[]>(photos);
  const [isLoading, setIsLoading] = useState(false);

  const uploadMutation = trpc.photos.upload.useMutation();
  const reorderMutation = trpc.photos.updateOrdering.useMutation();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const upload = async (dataUrl: string) => {
    console.log("uploading", dataUrl.slice(0, 50));
    setIsLoading(true);
    const p = await uploadMutation.mutateAsync({
      schoolId: id,
      dataUrl,
    });

    console.log("uploaded", p);

    setImages((images) => [...images, p]);
    setIsLoading(false);
  };

  const onUploadChange = async (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    console.log(imageList, addUpdateIndex);

    for (const image of imageList) {
      if (image.file) {
        console.log("Uploading file", image.file);
        await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            const dataUrl = e.target?.result as string;
            await upload(dataUrl);
            resolve(null);
          };
          reader.readAsDataURL(image.file as Blob);
        });
      }
    }
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    console.log("Drag end", active, over);

    if (!active || !over) {
      return;
    }

    const activeImage = images.find((i) => i.id == active.id);
    const overImage = images.find((i) => i.id == over.id);

    if (active.id !== over.id && activeImage && overImage) {
      setImages((images) => {
        const oldIndex = images.indexOf(activeImage);
        const newIndex = images.indexOf(overImage);

        console.log("Moving", oldIndex, newIndex);

        const newImages = arrayMove(images, oldIndex, newIndex);

        void reorderMutation.mutateAsync({
          schoolId: id,
          newOrder: newImages.map((i) => i.id),
        });

        return newImages;
      });
    }
  }

  return (
    <div key={id} className="border-b-[1px] border-gray-200  pb-6 pt-2">
      <div className="mb-8 flex items-center gap-2">
        {sigla && (
          <img src={getUrlSigla(id, "xs")} alt="" className="mr-4 h-6 w-6" />
        )}
        <h2>
          {rank ? `${rank}. ` : ""}
          <span className="font-medium">{nume}</span>
        </h2>

        <div
          className={twMerge(
            "ml-auto font-medium",
            images.length == 0
              ? "text-red-500"
              : images.length < MIN_PHOTOS
              ? "text-orange-500"
              : "text-green-500"
          )}
        >
          <FaDotCircle className="mr-2 mt-[-2px] inline" />
          {images.length == 0
            ? "Fără imagini"
            : images.length < MIN_PHOTOS
            ? "Prea puține imagini"
            : "Imagini suficiente"}
        </div>
      </div>

      {/* Links școală */}
      <div className="my-4 flex flex-col">
        <LinkText
          href={
            "https://google.com/search?q=" +
            encodeURIComponent(nume + " " + judet.numeIntreg + " foto")
          }
          target="_blank"
        >
          <FaExternalLinkAlt className="mr-2 mt-[-2px] inline" />
          Caută imagini pe Google
        </LinkText>
        {website && (
          <LinkText href={website} target="_blank">
            <FaExternalLinkAlt className="mr-2 mt-[-2px] inline" />
            {website.replace(/https?:\/\//, "").replace(/\/$/, "")}
          </LinkText>
        )}
      </div>

      {/* Adaugare imagini */}
      <ReactImageUploading
        multiple
        value={[]}
        onChange={(list, index) => {
          void onUploadChange(list, index);
        }}
        maxNumber={10}
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
          <div className="mb-2 flex select-none flex-col gap-1">
            <div
              className={twMerge(
                "relative flex h-24 w-full flex-row items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 p-1",
                isDragging && " [&>*]:pointer-events-none",
                !isLoading && "cursor-pointer"
              )}
              onClick={!isLoading ? onImageUpload : undefined}
              {...(!isLoading ? dragProps : {})}
            >
              {isLoading ? (
                <LoadingSpinner />
              ) : isDragging ? (
                <FaCamera className="text-4xl text-gray-500" />
              ) : (
                <>
                  <FaPlus className="mr-2 text-2xl text-gray-500" />
                  <span className="text-center  font-medium text-gray-500 [text-wrap:balance]">
                    Adaugă imagini
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </ReactImageUploading>

      {/* Imagini existente */}
      <div className="flex flex-col gap-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images}
            strategy={verticalListSortingStrategy}
          >
            {images.map((photo) => (
              <Photo key={photo.id} photo={photo} setImages={setImages} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

function Photo({
  photo,
  setImages,
}: {
  photo: PhotoType;
  setImages: React.Dispatch<React.SetStateAction<PhotoType[]>>;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({ id: photo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const deleteMutation = trpc.photos.delete.useMutation();
  const sourceMutation = trpc.photos.updateSource.useMutation();

  const syncTimeoutsRef = useRef<{
    [key: number]: ReturnType<typeof setTimeout>;
  }>({});

  const updatePhotoSource = (photoId: number, source: string) => {
    // await trpc.photos.delete.mutateAsync({ photoId, source });
    console.log("Updating", photoId, source);
    const oldTimeout = syncTimeoutsRef.current[photoId];

    if (oldTimeout) {
      clearTimeout(oldTimeout);
    }

    syncTimeoutsRef.current[photoId] = setTimeout(() => {
      void (async () => {
        const info_modificare = await sourceMutation.mutateAsync({
          photoId,
          source,
        });
        setImages((images) =>
          images.map((image) =>
            image.id == photoId
              ? { ...image, modified_info: info_modificare }
              : image
          )
        );
        console.log("Updated", photoId, source);
      })();
    }, SAVE_SOURCE_UPDATE_DELAY);

    setImages((images) =>
      images.map((image) =>
        image.id == photoId ? { ...image, source } : image
      )
    );
  };

  return (
    <div
      className="relative flex gap-8 overflow-hidden rounded-lg border-[1px] border-gray-200 bg-white p-4"
      ref={setNodeRef}
      style={{ zIndex: attributes["aria-pressed"] ? 10 : undefined, ...style }}
    >
      <a
        href={getRawFileUrl(photo.file_name)}
        target="_blank"
        className="self-center"
      >
        <img
          src={getPhotoUrl(photo.id, "xs")}
          alt=""
          className="w-48  rounded-lg"
        />
      </a>
      <div className="flex flex-col">
        <div className="mb-2 flex flex-row gap-2">
          <TextInput
            placeHolder={"Sursă imagine"}
            onChange={(value) => void updatePhotoSource(photo.id, value)}
            Icon={FaEarthAmericas}
            className="-ml-1 w-96"
            value={photo.source || ""}
          />
        </div>

        <p className="text-base text-gray-600">
          Adaugată: {photo.created_info}
        </p>
        <p className="text-base text-gray-600">
          Ultima modificare: {photo.modified_info}
        </p>

        <button
          className="mt-2 flex w-fit items-center gap-1 text-base font-semibold text-red-500"
          onClick={() => {
            console.log("Deleting", photo.id);
            void deleteMutation.mutateAsync({ photoId: photo.id });
            setImages((images) =>
              images.filter((image) => image.id != photo.id)
            );
          }}
        >
          <IoClose className="-mb-[1px] -ml-1 text-lg" />
          Șterge
        </button>
      </div>
      <div
        ref={setActivatorNodeRef}
        {...listeners}
        {...attributes}
        className="absolute right-4 h-fit cursor-pointer self-center rounded py-2 text-4xl text-gray-400 hover:bg-gray-100"
      >
        <MdDragIndicator />
      </div>
    </div>
  );
}
