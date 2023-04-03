import { selectedNoteIdAtom } from "@/stores/selectedChannelIdAtom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { inputAtom, titleAtom } from "@/stores/editTextAreaAtom";
import { notesConverter } from "@/utils/firestoreDataConverter";
import { collection, orderBy, query } from "firebase/firestore";
import MilkdownEditor from "@/components/ui/MilkdownEditor";
import React, { useEffect, useMemo, useState } from "react";
import useNotes from "@/components/hooks/useNotes";
import { MilkdownProvider } from "@milkdown/react";
import { isSyncedAtom } from "@/stores/isSynced";
import { useAtom, useAtomValue } from "jotai";
import { toast } from "react-hot-toast";
import { stringify } from "querystring";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";
type TextAreaProps = {
  user?: User | null;
  shiftRight?: boolean;
};

const TextArea = ({ user, shiftRight }: TextAreaProps) => {
  const [selectedNoteId, setSelectedNoteId] = useAtom(selectedNoteIdAtom);
  const [isSynced, setIsSynced] = useAtom(isSyncedAtom);
  const [title, setTitle] = useAtom(titleAtom);
  const [input, setInput] = useAtom(inputAtom);
  const { updateNote, deleteNote, createNote } = useNotes({
    userId: user?.uid,
  });

  const [firestoreNotes] = useCollectionData(
    user &&
      query(
        collection(db, "users", user.uid, "notes"),
        orderBy("updatedAt", "desc")
      ).withConverter(notesConverter)
  );

  const notes = useMemo(() => {
    if (!firestoreNotes) return;
    if (firestoreNotes.length > 0 && !selectedNoteId) {
      setSelectedNoteId(firestoreNotes[0].id);
    }
    return firestoreNotes;
  }, [firestoreNotes]);

  useEffect(() => {
    if (!notes) return;
    if (!selectedNoteId) {
      return;
    }
    if (notes.length < 1) {
      setTitle("");
      setInput("");
      return;
    }
    const selectedNote = notes.find((note) => note.id === selectedNoteId);
    console.log("🚀 => file: index.tsx:40 => selectedNote:", selectedNote);
    if (!selectedNote) return;

    setInput(selectedNote.content);
    setTitle(selectedNote.title);
  }, [notes, selectedNoteId]);

  useEffect(() => {
    //CHECKING IF SELECTEDNOTEID HAS CHANGED ALONGSIDE TITLE AND INPUT
    if (
      selectedNoteId ===
        notes?.find((note) => input === note.content && title === note.title)
          ?.id ||
      !selectedNoteId ||
      !user
    )
      return;
    setIsSynced(false);
    const interval = setTimeout(() => {
      updateNote({
        id: selectedNoteId,
        title: title === "" ? "Untitled" : title,
        content: input,
      });
      toast.success("Autosaved!");
      setIsSynced(true);
    }, 3000);

    return () => clearInterval(interval);
  }, [title, input]);

  return (
    <div className="flex w-full items-start justify-center overflow-y-scroll">
      <div
        className={`mt-52 h-fit min-h-full w-full max-w-3xl rounded-xl bg-white p-5 transition-transform duration-300 ${
          shiftRight ? "translate-x-52" : "translate-x-0"
        }`}
      >
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => {
              if (
                !selectedNoteId ||
                !notes?.find((note) => note.id === selectedNoteId)
              )
                return;
              updateNote({
                id: selectedNoteId,
                title: title === "" ? "Untitled" : title,
                content: input,
              });
              setIsSynced(true);
              toast.success("Saved!");
            }}
          >
            Save
          </button>
          <button
            type="button"
            className="rounded-full bg-red-200 p-2 text-red-600"
            onClick={(e) => {
              if (!firestoreNotes || !selectedNoteId) return;
              deleteNote(selectedNoteId);
              toast.success("Deleted!");

              setSelectedNoteId(firestoreNotes[0].id);
            }}
          >
            Delete Post
          </button>
        </div>
        <input
          type="text"
          className="w-full appearance-none border-none p-0 text-3xl font-bold leading-relaxed focus:outline-none"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          value={title}
        />

        <div className="mb-5 mt-3 h-0.5 w-full rounded-full bg-slate-200" />

        <MilkdownProvider>
          <MilkdownEditor
            input={input}
            setInput={setInput}
            className="markdown prose h-max min-w-full focus:outline-none"
            notes={notes}
          />
        </MilkdownProvider>
      </div>
    </div>
  );
};

export default TextArea;
