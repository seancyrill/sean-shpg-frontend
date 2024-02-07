function DragOverlay() {
  return (
    <div className="fixed left-0 top-0 z-[1000] grid h-full w-full place-content-center border-8 border-dashed bg-Orange bg-opacity-40 p-12 text-2xl">
      <div className="m-auto border-4 border-dashed bg-Very-dark-blue bg-opacity-40 p-4 text-center text-White">
        DROP ANYWHERE
      </div>
    </div>
  );
}

export default DragOverlay;
