import { useEffect, useRef, useState } from "react";

const SearchableModal = (items = [], searchKey = "name") => {
  const [showModal, setShowModal] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);

  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const rowRefs = useRef([]);

  const filteredItems = items.filter((item) =>
    item[searchKey]?.toLowerCase().includes(filterText.toLowerCase())
  );

  useEffect(() => {
    if (showModal && inputRef.current) inputRef.current.focus();
    if (!showModal) setFilterText("");
  }, [showModal]);

  useEffect(() => {
    const handleGlobalKey = (e) => {
      if (
        showModal &&
        inputRef.current &&
        document.activeElement !== inputRef.current
      ) {
        inputRef.current.focus();
      }

      // if (e.key === "Escape") setShowModal(false);
    };

    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [showModal]);

  useEffect(() => {
    const el = rowRefs.current[focusedIndex];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [focusedIndex]);

  return {
    showModal,
    setShowModal,
    filterText,
    setFilterText,
    focusedIndex,
    setFocusedIndex,
    modalRef,
    inputRef,
    rowRefs,
    filteredItems,
  };
};

export default SearchableModal;
