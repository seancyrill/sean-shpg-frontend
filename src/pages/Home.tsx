import Banner from "../components/Banner";
import Browsing from "../components/Browsing";

function Home() {
  return (
    <div className="flex flex-col gap-4">
      <Banner />
      <Browsing title="new items" nextBatch={true} />;
    </div>
  );
}

export default Home;
