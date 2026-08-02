import { HomeExperience } from "@/components/home/HomeExperience";
import { WorkList } from "@/components/home/WorkList";
import { MoreSection } from "@/components/home/MoreSection";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <HomeExperience />
      <WorkList />
      <MoreSection />
    </div>
  );
}
