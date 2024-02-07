import { useState, useEffect } from "react";

const useDragAndDrop = (
  handleDrop: (event: DragEvent) => void,
  handleDragOver: (event: DragEvent) => void
) => {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleDocumentDrop = (event: DragEvent) => {
      event.preventDefault();
      setIsDragging(false);
      handleDrop(event);
    };

    const handleDocumentDragOver = (event: DragEvent) => {
      event.preventDefault();
      setIsDragging(true);
      handleDragOver(event);
    };

    const handleDocumentDragEnd = () => {
      setIsDragging(false);
    };

    document.addEventListener("drop", handleDocumentDrop);
    document.addEventListener("dragover", handleDocumentDragOver);
    document.addEventListener("dragend", handleDocumentDragEnd);
    document.addEventListener("dragleave", handleDocumentDragEnd);

    return () => {
      document.removeEventListener("drop", handleDocumentDrop);
      document.removeEventListener("dragover", handleDocumentDragOver);
      document.removeEventListener("dragend", handleDocumentDragEnd);
      document.addEventListener("dragleave", handleDocumentDragEnd);
    };
  }, [handleDrop, handleDragOver]);

  return { isDragging };
};

export default useDragAndDrop;
