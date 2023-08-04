import { redirect } from "next/navigation";
import { ultimulAnBac } from "~/data/dbQuery";

export default function Page() {
  redirect(`/top_licee/${ultimulAnBac}`);
}
